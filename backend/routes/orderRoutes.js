const express = require('express');
const router = express.Router();
const {
    addOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController');
const { validateToken, isAdmin } = require('../middleware/auth');

// POST add new order (Authenticated users)
router.post('/', validateToken, addOrder);

// GET all orders (Admin only)
router.get('/', validateToken, isAdmin, getAllOrders);

// GET order by ID (Authenticated users - should be own order or admin)
router.get('/:id', validateToken, getOrderById);

// GET orders by user ID (Authenticated users)
router.get('/user/:userId', validateToken, getOrdersByUserId);

// PUT update order (Admin only - for status updates)
router.put('/:id', validateToken, isAdmin, updateOrder);

// DELETE order (Admin only)
router.delete('/:id', validateToken, isAdmin, deleteOrder);

module.exports = router;
