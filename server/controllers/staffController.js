const Complaint = require('../models/Complaint');
const ComplaintUpdate = require('../models/ComplaintUpdate');
const Notification = require('../models/Notification');

// @desc    Get complaints assigned to current staff member
// @route   GET /api/staff/tasks
// @access  Private (Staff)
exports.getAssignedTasks = async (req, res, next) => {
  try {
    const tasks = await Complaint.find({ assignedStaff: req.user._id })
      .populate('department')
      .populate('reporter.user', 'name phone')
      .sort({ updatedAt: -1 });

    const stats = {
      totalAssigned: tasks.length,
      pendingAction: tasks.filter((t) => t.status === 'ASSIGNED').length,
      inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      resolved: tasks.filter((t) => ['RESOLVED', 'CLOSED'].includes(t.status)).length,
      reopened: tasks.filter((t) => t.status === 'REOPENED').length,
    };

    res.status(200).json({
      success: true,
      stats,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status by staff (e.g. IN_PROGRESS or RESOLVED)
// @route   PATCH /api/staff/tasks/:id/update
// @access  Private (Staff)
exports.updateTaskProgress = async (req, res, next) => {
  try {
    const { status, note, evidencePhotoUrl } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint task not found' });
    }

    // Authorization check
    if (
      complaint.assignedStaff &&
      complaint.assignedStaff.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only update tasks assigned to your account',
      });
    }

    const prevStatus = complaint.status;

    // Staff allowed transitions: ASSIGNED -> IN_PROGRESS, IN_PROGRESS -> RESOLVED, REOPENED -> IN_PROGRESS
    if (status) {
      const allowedForStaff = ['IN_PROGRESS', 'RESOLVED'];
      if (!allowedForStaff.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Field staff can only update status to IN_PROGRESS or RESOLVED.`,
        });
      }
      complaint.status = status;
    }

    if (evidencePhotoUrl) {
      complaint.resolutionEvidence.push({
        url: evidencePhotoUrl,
        note: note || 'Resolution evidence submitted by staff',
        resolvedAt: new Date(),
      });
    }

    await complaint.save();

    // Add to audit timeline
    await ComplaintUpdate.create({
      complaint: complaint._id,
      ticketId: complaint.ticketId,
      previousStatus: prevStatus,
      newStatus: complaint.status,
      note: note || `Work progress updated to ${complaint.status} by field staff.`,
      updatedBy: {
        user: req.user._id,
        name: req.user.name,
        role: 'staff',
      },
      evidencePhoto: evidencePhotoUrl || '',
    });

    // Notify citizen
    await Notification.create({
      recipient: complaint.reporter.user,
      title: `Work Update: ${complaint.status}`,
      message: `Field staff updated issue [${complaint.ticketId}] to ${complaint.status}. Note: "${note || 'Work progress recorded.'}"`,
      type: 'STATUS_CHANGE',
      complaintId: complaint._id,
      ticketId: complaint.ticketId,
    });

    res.status(200).json({
      success: true,
      message: 'Task progress updated successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};
