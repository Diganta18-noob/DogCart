const User = require('../models/user');
const { generateToken } = require('../middleware/auth');

// Add user (registration)
const addUser = async (req, res) => {
    try {
        await User.create(req.body);
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by email and password (login)
const getUserByEmailAndPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
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

        user.password = password;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addUser,
    getUserByEmailAndPassword,
    resetPassword,
    getAllUsers
};
