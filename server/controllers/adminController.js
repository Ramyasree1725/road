const Complaint = require('../models/Complaint');
const ComplaintUpdate = require('../models/ComplaintUpdate');
const User = require('../models/User');
const Department = require('../models/Department');
const Notification = require('../models/Notification');

// Valid workflow transitions map
const VALID_TRANSITIONS = {
  SUBMITTED: ['UNDER_REVIEW', 'VERIFIED', 'REJECTED'],
  UNDER_REVIEW: ['VERIFIED', 'REJECTED'],
  VERIFIED: ['ASSIGNED', 'REJECTED'],
  ASSIGNED: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: ['REOPENED', 'CLOSED'],
  REOPENED: ['ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW'],
  REJECTED: ['UNDER_REVIEW'],
  CLOSED: [],
};

// @desc    Get Admin Dashboard Stats & Analytics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments();
    const open = await Complaint.countDocuments({
      status: { $in: ['SUBMITTED', 'UNDER_REVIEW'] },
    });
    const verified = await Complaint.countDocuments({ status: 'VERIFIED' });
    const active = await Complaint.countDocuments({
      status: { $in: ['ASSIGNED', 'IN_PROGRESS', 'REOPENED'] },
    });
    const resolved = await Complaint.countDocuments({
      status: { $in: ['RESOLVED', 'CLOSED'] },
    });
    const rejected = await Complaint.countDocuments({ status: 'REJECTED' });

    // Category aggregation
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Priority aggregation
    const priorityStats = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Locality / Ward aggregation
    const wardStats = await Complaint.aggregate([
      { $group: { _id: '$location.wardOrZone', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // Staff count
    const totalStaff = await User.countDocuments({ role: 'staff' });
    const totalCitizens = await User.countDocuments({ role: 'citizen' });

    // Resolution rate %
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        total,
        open,
        verified,
        active,
        resolved,
        rejected,
        resolutionRate,
        totalStaff,
        totalCitizens,
      },
      categoryStats: categoryStats.map((c) => ({ name: c._id, count: c.count })),
      priorityStats: priorityStats.map((p) => ({ name: p._id, count: p.count })),
      wardStats: wardStats.map((w) => ({ name: w._id || 'General', count: w.count })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints with pagination and filters
// @route   GET /api/admin/complaints
// @access  Private (Admin)
exports.getAllComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, departmentId, search } = req.query;
    let query = {};

    if (status && status !== 'All') query.status = status;
    if (category && category !== 'All') query.category = category;
    if (priority && priority !== 'All') query.priority = priority;
    if (departmentId && departmentId !== 'All') query.department = departmentId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
        { 'reporter.name': { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('department')
      .populate('assignedStaff', 'name email phone')
      .populate('reporter.user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status with workflow enforcement
// @route   PATCH /api/admin/complaints/:id/status
// @access  Private (Admin)
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, note, priority } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const prevStatus = complaint.status;

    // Check workflow validation
    const allowed = VALID_TRANSITIONS[prevStatus] || [];
    if (status && status !== prevStatus && !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid workflow transition: Cannot move complaint directly from "${prevStatus}" to "${status}". Allowed next steps: ${allowed.join(', ') || 'None'}`,
      });
    }

    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;
    await complaint.save();

    // Log update history
    await ComplaintUpdate.create({
      complaint: complaint._id,
      ticketId: complaint.ticketId,
      previousStatus: prevStatus,
      newStatus: status || prevStatus,
      note: note || `Status transitioned to ${status} by Administrator.`,
      updatedBy: {
        user: req.user._id,
        name: req.user.name,
        role: 'admin',
      },
    });

    // Notify citizen
    await Notification.create({
      recipient: complaint.reporter.user,
      title: `Complaint Status Updated: ${status}`,
      message: `Your complaint [${complaint.ticketId}] status was updated to ${status}. Note: ${note || 'Status verified by municipality.'}`,
      type: 'STATUS_CHANGE',
      complaintId: complaint._id,
      ticketId: complaint.ticketId,
    });

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign department and staff
// @route   POST /api/admin/complaints/:id/assign
// @access  Private (Admin)
exports.assignStaff = async (req, res, next) => {
  try {
    const { departmentId, staffId, note, estimatedDays } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (departmentId) complaint.department = departmentId;
    if (staffId) complaint.assignedStaff = staffId;

    if (estimatedDays) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + Number(estimatedDays));
      complaint.estimatedCompletionDate = targetDate;
    }

    const prevStatus = complaint.status;
    complaint.status = 'ASSIGNED';
    await complaint.save();

    await ComplaintUpdate.create({
      complaint: complaint._id,
      ticketId: complaint.ticketId,
      previousStatus: prevStatus,
      newStatus: 'ASSIGNED',
      note: note || 'Assigned to field staff for on-ground inspection and resolution.',
      updatedBy: {
        user: req.user._id,
        name: req.user.name,
        role: 'admin',
      },
    });

    // Notify staff
    if (staffId) {
      await Notification.create({
        recipient: staffId,
        title: `New Task Assigned [${complaint.ticketId}]`,
        message: `You have been assigned to handle: "${complaint.title}" at ${complaint.location.address}.`,
        type: 'ASSIGNMENT',
        complaintId: complaint._id,
        ticketId: complaint.ticketId,
      });
    }

    // Notify citizen
    await Notification.create({
      recipient: complaint.reporter.user,
      title: `Staff Assigned to Your Issue`,
      message: `Municipal staff has been assigned to inspect and resolve your issue [${complaint.ticketId}].`,
      type: 'ASSIGNMENT',
      complaintId: complaint._id,
      ticketId: complaint.ticketId,
    });

    res.status(200).json({
      success: true,
      message: 'Staff and department assigned successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list (manage users)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('department', 'name code').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or active status
// @route   PATCH /api/admin/users/:id
// @access  Private (Admin)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { role, isActive, departmentId } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (departmentId !== undefined) user.department = departmentId || null;

    await user.save();
    res.status(200).json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get or create departments
// @route   GET /api/admin/departments
// @access  Private (Admin / Staff)
exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.status(200).json({ success: true, departments });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new department
// @route   POST /api/admin/departments
// @access  Private (Admin)
exports.createDepartment = async (req, res, next) => {
  try {
    const { name, code, description, contactEmail, contactPhone, headOfficer, categories } =
      req.body;
    const department = await Department.create({
      name,
      code,
      description,
      contactEmail,
      contactPhone,
      headOfficer,
      categories: categories || [],
    });
    res.status(201).json({ success: true, department });
  } catch (error) {
    next(error);
  }
};
