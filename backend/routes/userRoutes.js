const express = require('express');
const router = express.Router();
const {
    addUser,
    getUserByEmailAndPassword,
    resetPassword,
    getAllUsers
} = require('../controllers/userController');

// GET all users
router.get('/', getAllUsers);

// POST register user
router.post('/register', addUser);

// POST login user
router.post('/login', getUserByEmailAndPassword);

// PUT reset password
router.put('/reset-password', resetPassword);

module.exports = router;
