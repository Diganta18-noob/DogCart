const mongoose = require('mongoose');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Dog = require('../models/dog');

// Add order
const addOrder = async (req, res) => {
    try {
        console.log(req.body);

        const { orderItems, user, shippingAddress, billingAddress } = req.body;

        // Validate that order contains at least one item
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }

        // Create order with empty orderItems and totalAmount 0
        const newOrder = new Order({
            user: new mongoose.Types.ObjectId(user),
            orderItems: [],
            totalAmount: 0,
            orderStatus: 'Pending',
            shippingAddress: shippingAddress,
            billingAddress: billingAddress
        });

        // Save the empty order first
        await newOrder.save();

        let totalAmount = 0;
        const orderItemIds = [];

        // Process each order item
        for (const item of orderItems) {
            // Check if dog exists
            const dog = await Dog.findById(item.dog);
            if (!dog) {
                return res.status(404).json({ message: `Dog with ID ${item.dog} not found` });
            }

            // Check stock availability
            if (dog.stockQuantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${dog.dogName}` });
            }

            // Deduct stock
            dog.stockQuantity -= item.quantity;
            await dog.save();

            // Create order item
            const orderItem = new OrderItem({
                quantity: item.quantity,
                price: dog.price,
                dog: item.dog,
                order: newOrder._id
            });

            await orderItem.save();
            orderItemIds.push(orderItem._id);
            totalAmount += dog.price * item.quantity;
        }

        // Update order with items and total
        newOrder.orderItems = orderItemIds;
        newOrder.totalAmount = totalAmount;
        await newOrder.save();

        res.status(201).json({ message: 'Order Added Successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'username email mobileNumber')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'dog',
                    select: 'dogName category coverImage price'
                }
            });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .populate('user', 'username email mobileNumber')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'dog'
                }
            });

        if (!order) {
            return res.status(404).json({ message: `Cannot find any order with ID ${id}` });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get orders by user ID
const getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId })
            .populate('user', 'username email mobileNumber')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'dog'
                }
            });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: `No orders found for user ID ${userId}` });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: `Cannot find any order with ID ${id}` });
        }

        res.status(200).json({ message: 'Order Updated Successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: `Cannot find any order with ID ${id}` });
        }

        res.status(200).json({ message: 'Order Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    updateOrder,
    deleteOrder
};
