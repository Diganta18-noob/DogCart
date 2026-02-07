const User = require('../models/user');
const Dog = require('../models/dog');
const Order = require('../models/order');
const Review = require('../models/review');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ userRole: 'User' });
        const totalPets = await Dog.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalReviews = await Review.countDocuments();

        res.status(200).json({
            totalUsers,
            totalPets,
            totalOrders,
            totalReviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users (non-admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ userRole: 'User' }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers
};
