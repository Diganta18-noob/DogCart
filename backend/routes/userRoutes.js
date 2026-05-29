const express = require('express');
const router = express.Router();
const {
    addUser,
    getUserByEmailAndPassword,
    resetPassword,
    getAllUsers,
    verifyEmail,
} = require('../controllers/userController');
const { validateToken, isAdmin } = require('../middleware/auth');

// GET all users (Admin only)
router.get('/', validateToken, isAdmin, getAllUsers);

// POST register user
router.post('/register', addUser);

// POST login user
router.post('/login', getUserByEmailAndPassword);

// POST verify email (for forgot password flow)
router.post('/verify-email', verifyEmail);

// PUT reset password
router.put('/reset-password', resetPassword);

module.exports = router;
