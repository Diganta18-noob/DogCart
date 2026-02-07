import React, { useState, useEffect } from 'react';
import api, { endpoints } from '../apiConfig';
import './OrderPlaced.css';

const DEFAULT_PET_IMAGE = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop';

const orderStatuses = ['Pending', 'Confirmed', 'OutForDelivery', 'Delivered', 'Cancelled'];

const OrderPlaced = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showItemsModal, setShowItemsModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 6;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const ordersRes = await api.get(endpoints.orders);
            setOrders(ordersRes.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const filteredOrders = orders.filter(order => {
        const orderId = order._id || '';
        const username = order.user?.username || '';
        return orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            username.toLowerCase().includes(searchTerm.toLowerCase());
    }).sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.orderDate || 0) - new Date(a.orderDate || 0);
        }
        if (sortBy === 'total') return (b.totalAmount || 0) - (a.totalAmount || 0);
        return 0;
    });

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(endpoints.orderById(orderId), { orderStatus: newStatus });
            setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update order status');
        }
    };

    const handleViewItems = (order) => {
        setSelectedOrder(order);
        setShowItemsModal(true);
    };

    const handleViewProfile = (user) => {
        setSelectedUser(user);
        setShowProfileModal(true);
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

    if (loading) return <div className="loading">Loading orders...</div>;

    return (
        <div className="orders-container">
            <h1 className="orders-title">Orders Placed</h1>

            <div className="filters-section">
                <input
                    type="text"
                    placeholder="Search by Order ID or Username..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="search-input"
                />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                    <option value="date">Sort by Date</option>
                    <option value="total">Sort by Total</option>
                </select>
            </div>

            {paginatedOrders.length === 0 ? (
                <div className="no-orders">
                    <span className="empty-icon">📦</span>
                    <p>No orders found.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {paginatedOrders.map(order => {
                        const orderItems = getOrderItems(order);
                        return (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div className="order-id">Order #{order._id?.slice(-8)}</div>
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
                                        <span className="label">Customer:</span>
                                        <span className="value">{order.user?.username || 'Unknown'}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Date:</span>
                                        <span className="value">{formatDate(order.orderDate)}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Total:</span>
                                        <span className="value total">₹{order.totalAmount?.toLocaleString()}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Items:</span>
                                        <span className="value">{order.orderItems?.length || 0} pet(s)</span>
                                    </div>
                                </div>
                                {/* Order Items Preview */}
                                <div className="order-items-preview">
                                    {orderItems.slice(0, 3).map((item, idx) => (
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
                                    {orderItems.length > 3 && (
                                        <div className="more-items">+{orderItems.length - 3} more</div>
                                    )}
                                </div>
                                <div className="order-address-info">
                                    <p><strong>Shipping:</strong> {order.shippingAddress || 'N/A'}</p>
                                    <p><strong>Billing:</strong> {order.billingAddress || 'N/A'}</p>
                                </div>
                                <div className="order-actions">
                                    <div className="status-update">
                                        <label>Update Status:</label>
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="status-select"
                                        >
                                            {orderStatuses.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => handleViewItems(order)}
                                            className="view-btn"
                                        >
                                            View Items
                                        </button>
                                        <button
                                            onClick={() => handleViewProfile(order.user)}
                                            className="profile-btn"
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        ⬅ Previous
                    </button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                    >
                        Next ➡
                    </button>
                </div>
            )}

            {/* View Items Modal */}
            {showItemsModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowItemsModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowItemsModal(false)}>×</button>
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
                        <div className="order-total-row">
                            <strong>Total:</strong>
                            <span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* View Profile Modal */}
            {showProfileModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
                    <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowProfileModal(false)}>×</button>
                        <h3>Customer Profile</h3>
                        <div className="profile-info">
                            <div className="profile-avatar">
                                {selectedUser.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="profile-details">
                                <p><strong>Username:</strong> {selectedUser.username}</p>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Mobile:</strong> {selectedUser.mobileNumber || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderPlaced;

