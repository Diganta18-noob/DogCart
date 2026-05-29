const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../middleware/auth');

const SALT_ROUNDS = 10;

// Add user (registration)
const addUser = async (req, res) => {
    try {
        const { username, email, mobileNumber, password, userRole } = req.body;

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        await User.create({
            username,
            email,
            mobileNumber,
            password: hashedPassword,
            userRole,
        });
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by email and password (login)
const getUserByEmailAndPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id, user.userRole);

        res.status(200).json({
            message: 'Success',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                mobileNumber: user.mobileNumber,
                userRole: user.userRole
            },
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password before saving
        user.password = await bcrypt.hash(password, SALT_ROUNDS);
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify if email exists (for forgot password flow — doesn't expose user data)
const verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select('_id');
        if (user) {
            res.status(200).json({ exists: true, message: 'Email verified' });
        } else {
            res.status(404).json({ exists: false, message: 'Email not found in our records' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addUser,
    getUserByEmailAndPassword,
    resetPassword,
    getAllUsers,
    verifyEmail,
};
