const Complaint = require('../models/Complaint');
const ComplaintUpdate = require('../models/ComplaintUpdate');
const Notification = require('../models/Notification');
const Department = require('../models/Department');

// Helper to generate unique ticket ID
const generateTicketId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CF-${year}-${randomNum}`;
};

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
exports.createComplaint = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      address,
      landmark,
      wardOrZone,
      coordinates,
      photos,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and address',
      });
    }

    // Auto-match department by category
    const matchedDept = await Department.findOne({
      categories: category,
      isActive: true,
    });

    const ticketId = generateTicketId();

    // Longitude & Latitude parser
    let coords = [80.2707, 13.0827];
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      coords = [Number(coordinates[0]), Number(coordinates[1])];
    }

    const complaint = await Complaint.create({
      ticketId,
      title,
      description,
      category,
      priority: priority || 'MEDIUM',
      reporter: {
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '',
      },
      department: matchedDept ? matchedDept._id : null,
      location: {
        type: 'Point',
        coordinates: coords,
        address,
        landmark: landmark || '',
        wardOrZone: wardOrZone || 'Central Zone',
      },
      photos: photos && Array.isArray(photos) ? photos : [],
      status: 'SUBMITTED',
    });

    // Create initial timeline history update
    await ComplaintUpdate.create({
      complaint: complaint._id,
      ticketId: complaint.ticketId,
      previousStatus: 'NONE',
      newStatus: 'SUBMITTED',
      note: 'Civic issue reported and registered into the system.',
      updatedBy: {
        user: req.user._id,
        name: req.user.name,
        role: req.user.role,
      },
    });

    // Notify citizen
    await Notification.create({
      recipient: req.user._id,
      title: 'Complaint Submitted Successfully',
      message: `Your complaint for "${title}" has been registered with Ticket ID ${ticketId}.`,
      type: 'STATUS_CHANGE',
      complaintId: complaint._id,
      ticketId,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public complaints for map and public feed (Privacy protected)
// @route   GET /api/complaints/public
// @access  Public
exports.getPublicComplaints = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
      ];
    }

    // OWASP & Privacy protection: exclude citizen contact info from public listing
    const complaints = await Complaint.find(query)
      .select('-reporter.email -reporter.phone')
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own complaints (Citizen Dashboard)
// @route   GET /api/complaints/my
// @access  Private
exports.getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ 'reporter.user': req.user._id })
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    // Aggregate statistics
    const stats = {
      total: complaints.length,
      submitted: complaints.filter((c) => c.status === 'SUBMITTED').length,
      inProgress: complaints.filter((c) => ['ASSIGNED', 'IN_PROGRESS', 'VERIFIED'].includes(c.status)).length,
      resolved: complaints.filter((c) => ['RESOLVED', 'CLOSED'].includes(c.status)).length,
      reopened: complaints.filter((c) => c.status === 'REOPENED').length,
    };

    res.status(200).json({
      success: true,
      stats,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track single complaint by Ticket ID (Public search)
// @route   GET /api/complaints/track/:ticketId
// @access  Public
exports.trackByTicketId = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const complaint = await Complaint.findOne({
      ticketId: ticketId.trim().toUpperCase(),
    })
      .select('-reporter.email -reporter.phone')
      .populate('department', 'name code contactEmail contactPhone')
      .populate('assignedStaff', 'name');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `No complaint found with Ticket ID "${ticketId}"`,
      });
    }

    const updates = await ComplaintUpdate.find({ complaint: complaint._id }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      complaint,
      updates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint details by MongoDB ID
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('department')
      .populate('assignedStaff', 'name email phone role');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Role check: Citizen can only see their own complaint or public details
    if (
      req.user.role === 'citizen' &&
      complaint.reporter.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this private complaint record',
      });
    }

    const updates = await ComplaintUpdate.find({ complaint: complaint._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      complaint,
      updates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reopen a resolved complaint
// @route   POST /api/complaints/:id/reopen
// @access  Private (Citizen)
exports.reopenComplaint = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.reporter.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only original reporter can reopen' });
    }

    if (complaint.status !== 'RESOLVED') {
      return res.status(400).json({
        success: false,
        message: 'Only complaints with RESOLVED status can be reopened.',
      });
    }

    const prevStatus = complaint.status;
    complaint.status = 'REOPENED';
    complaint.reopenReason = reason || 'Issue was not adequately resolved.';
    complaint.reopenCount += 1;
    await complaint.save();

    await ComplaintUpdate.create({
      complaint: complaint._id,
      ticketId: complaint.ticketId,
      previousStatus: prevStatus,
      newStatus: 'REOPENED',
      note: `Complaint reopened by citizen: ${complaint.reopenReason}`,
      updatedBy: {
        user: req.user._id,
        name: req.user.name,
        role: 'citizen',
      },
    });

    // Notify assigned staff if present
    if (complaint.assignedStaff) {
      await Notification.create({
        recipient: complaint.assignedStaff,
        title: `Complaint Reopened [${complaint.ticketId}]`,
        message: `Citizen reopened issue: "${complaint.title}". Please review the feedback.`,
        type: 'REOPEN',
        complaintId: complaint._id,
        ticketId: complaint.ticketId,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint reopened successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit citizen resolution feedback
// @route   POST /api/complaints/:id/feedback
// @access  Private (Citizen)
exports.submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.feedback = {
      rating: Number(rating) || 5,
      comment: comment || '',
      submittedAt: new Date(),
    };

    if (complaint.status === 'RESOLVED') {
      complaint.status = 'CLOSED';
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Feedback submitted. Thank you for making our city better!',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};
