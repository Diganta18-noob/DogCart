import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../userSlice';
import api, { endpoints } from '../apiConfig';
import './UserViewOrders.css';

const DEFAULT_PET_IMAGE = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop';

const UserViewOrders = () => {
    const user = useSelector(selectUser);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showTrackModal, setShowTrackModal] = useState(false);
    const [trackingOrder, setTrackingOrder] = useState(null);

    useEffect(() => {
        if (user?.id) {
            fetchOrders();
        }
    }, [user?.id]);

    const fetchOrders = async () => {
        try {
            const response = await api.get(endpoints.ordersByUser(user.id));
            setOrders(response.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            // If 404 (no orders), just set empty array
            if (error.response?.status === 404) {
                setOrders([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            // Note: Users typically can't update orders, this might need admin endpoint
            await api.put(endpoints.orderById(orderId), { orderStatus: 'Cancelled' });
            setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o));
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Unable to cancel order. Please contact support.');
        }
    };

    const handleTrackOrder = async (order) => {
        try {
            // Fetch fresh order data to get latest status
            const response = await api.get(endpoints.orderById(order._id));
            const freshOrder = response.data;
            setTrackingOrder(freshOrder);
            setShowTrackModal(true);

            // Also update the order in the list
            setOrders(orders.map(o => o._id === order._id ? freshOrder : o));
        } catch (error) {
            console.error('Error fetching order:', error);
            // Fallback to local data
            setTrackingOrder(order);
            setShowTrackModal(true);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#f39c12';
            case 'Confirmed': return '#3498db';
            case 'OutForDelivery': return '#9b59b6';
            case 'Delivered': return '#27ae60';
            case 'Cancelled': return '#e74c3c';
            default: return '#95a5a6';
        }
    };

    const getTrackingSteps = (status) => {
        const steps = ['Pending', 'Confirmed', 'OutForDelivery', 'Delivered'];
        const currentIndex = steps.indexOf(status);
        return steps.map((step, index) => ({
            name: step === 'OutForDelivery' ? 'Out For Delivery' : step,
            completed: index <= currentIndex && status !== 'Cancelled',
            current: index === currentIndex
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Helper to get order items from populated data
    const getOrderItems = (order) => {
        if (!order.orderItems) return [];
        return order.orderItems.map(item => ({
            name: item.dog?.dogName || 'Unknown Pet',
            quantity: item.quantity,
            price: item.price,
            image: item.dog?.coverImage || DEFAULT_PET_IMAGE
        }));
    };

    if (loading) return <div className="loading">Loading orders...</div>;

    return (
        <div className="orders-container">
            <h1 className="orders-title">Order History</h1>

            {orders.length === 0 ? (
                <div className="no-orders">
                    <span className="empty-icon">📦</span>
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => {
                        const orderItems = getOrderItems(order);
                        return (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div className="order-id">Order ID: {order._id}</div>
                                    <span
                                        className="order-status"
                                        style={{
                                            background: getStatusColor(order.orderStatus) + '20',
                                            color: getStatusColor(order.orderStatus)
                                        }}
                                    >
                                        {order.orderStatus}
                                    </span>
                                </div>
                                <div className="order-info">
                                    <div className="info-row">
                                        <span className="label">Status:</span>
                                        <span className="value">{order.orderStatus}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Total:</span>
                                        <span className="value total">₹{order.totalAmount?.toLocaleString()}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Ship to:</span>
                                        <span className="value">{order.shippingAddress}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Bill to:</span>
                                        <span className="value">{order.billingAddress}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Date:</span>
                                        <span className="value">{formatDate(order.orderDate)}</span>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="order-items-preview">
                                    {orderItems.map((item, idx) => (
                                        <div key={idx} className="item-preview">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="item-image"
                                                onError={(e) => { e.target.src = DEFAULT_PET_IMAGE; }}
                                            />
                                            <div className="item-details">
                                                <span className="item-label">Pet:</span>
                                                <span className="item-name">{item.name}</span>
                                            </div>
                                            <span className="item-qty">Qty: {item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-actions">
                                    <button
                                        onClick={() => handleTrackOrder(order)}
                                        className="track-order-btn"
                                    >
                                        Track Order
                                    </button>
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="view-items-btn"
                                    >
                                        View Items
                                    </button>
                                    {order.orderStatus === 'Pending' && (
                                        <button
                                            onClick={() => handleCancelOrder(order._id)}
                                            className="cancel-btn"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View Items Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedOrder(null)}>×</button>
                        <h3>Order Items</h3>
                        <div className="order-items-list">
                            {getOrderItems(selectedOrder).map((item, idx) => (
                                <div key={idx} className="order-item">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="modal-item-image"
                                        onError={(e) => { e.target.src = DEFAULT_PET_IMAGE; }}
                                    />
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-qty">x{item.quantity}</span>
                                    <span className="item-price">₹{item.price?.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="address-info">
                            <p><strong>Shipping:</strong> {selectedOrder.shippingAddress}</p>
                            <p><strong>Billing:</strong> {selectedOrder.billingAddress}</p>
                        </div>
                        <div className="order-total-row">
                            <strong>Total:</strong>
                            <span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Track Order Modal */}
            {showTrackModal && trackingOrder && (
                <div className="modal-overlay" onClick={() => setShowTrackModal(false)}>
                    <div className="modal-content track-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowTrackModal(false)}>×</button>
                        <h3>Track Order #{(trackingOrder._id)?.slice(-8)}</h3>

                        {trackingOrder.orderStatus === 'Cancelled' ? (
                            <div className="cancelled-message">
                                <span className="cancelled-icon">❌</span>
                                <p>This order has been cancelled</p>
                            </div>
                        ) : (
                            <div className="tracking-timeline">
                                {getTrackingSteps(trackingOrder.orderStatus).map((step, index) => (
                                    <div key={index} className={`tracking-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}>
                                        <div className="step-indicator">
                                            {step.completed ? '✓' : (index + 1)}
                                        </div>
                                        <div className="step-name">{step.name}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserViewOrders;

