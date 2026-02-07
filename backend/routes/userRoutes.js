const express = require('express');
const router = express.Router();
const {
    addUser,
    getUserByEmailAndPassword
} = require('../controllers/userController');

// POST register user
router.post('/register', addUser);

// POST login user
router.post('/login', getUserByEmailAndPassword);

module.exports = router;
