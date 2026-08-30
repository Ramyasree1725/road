const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllComplaints,
  updateComplaintStatus,
  assignStaff,
  getUsers,
  updateUserStatus,
  getDepartments,
  createDepartment,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/complaints', getAllComplaints);
router.patch('/complaints/:id/status', updateComplaintStatus);
router.post('/complaints/:id/assign', assignStaff);

router.get('/users', getUsers);
router.patch('/users/:id', updateUserStatus);

router.get('/departments', getDepartments);
router.post('/departments', createDepartment);

module.exports = router;
