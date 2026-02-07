const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers } = require('../controllers/dashboardController');
const { validateToken, isAdmin } = require('../middleware/auth');

// GET dashboard statistics (Admin only)
router.get('/stats', validateToken, isAdmin, getDashboardStats);

// GET all users (Admin only)
router.get('/users', validateToken, isAdmin, getAllUsers);

module.exports = router;
