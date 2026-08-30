const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getPublicComplaints,
  getMyComplaints,
  trackByTicketId,
  getComplaintById,
  reopenComplaint,
  submitFeedback,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/public', getPublicComplaints);
router.get('/track/:ticketId', trackByTicketId);

// Protected routes (Citizen / Authenticated)
router.post('/', protect, createComplaint);
router.get('/my', protect, getMyComplaints);
router.get('/:id', protect, getComplaintById);
router.post('/:id/reopen', protect, reopenComplaint);
router.post('/:id/feedback', protect, submitFeedback);

module.exports = router;
