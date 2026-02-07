const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderDate: {
        type: Date,
        default: Date.now
    },
    orderStatus: {
        type: String,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    billingAddress: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem'
    }]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
