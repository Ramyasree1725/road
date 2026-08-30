const express = require('express');
const router = express.Router();
const { getAssignedTasks, updateTaskProgress } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/auth');

// Staff routes require authentication and 'staff' (or 'admin') role
router.use(protect);
router.use(authorize('staff', 'admin'));

router.get('/tasks', getAssignedTasks);
router.patch('/tasks/:id/update', updateTaskProgress);

module.exports = router;
