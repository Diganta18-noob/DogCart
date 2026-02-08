const express = require('express');
const router = express.Router();
const {
    addUser,
    getUserByEmailAndPassword,
    resetPassword
} = require('../controllers/userController');

// POST register user
router.post('/register', addUser);

// POST login user
router.post('/login', getUserByEmailAndPassword);

// PUT reset password
router.put('/reset-password', resetPassword);

module.exports = router;
