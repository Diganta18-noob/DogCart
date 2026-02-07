const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET_KEY = 'pawmart_secret_key_2024';

// Generate JWT token with userId and userRole
const generateToken = (userId, userRole) => {
    const token = jwt.sign({ id: userId, role: userRole }, SECRET_KEY, { expiresIn: '24h' });
    return token;
};

// Middleware: Validate JWT token
const validateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1] || authHeader;

        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // { id, role }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Middleware: Check if user is admin (must be used AFTER validateToken)
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.user.role || req.user.userRole;

    if (!userRole || userRole.toLowerCase() !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    next();
};

module.exports = { generateToken, validateToken, isAdmin };
