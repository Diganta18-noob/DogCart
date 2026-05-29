const User = require('../models/user');
const Dog = require('../models/dog');
const Order = require('../models/order');
const Review = require('../models/review');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Run all count queries in parallel for performance
        const [totalUsers, totalPets, totalOrders, totalReviews] = await Promise.all([
            User.countDocuments({ userRole: { $regex: /^user$/i } }),
            Dog.countDocuments(),
            Order.countDocuments(),
            Review.countDocuments(),
        ]);

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
        const users = await User.find({ userRole: { $regex: /^user$/i } })
            .select('-password')
            .lean();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers
};
