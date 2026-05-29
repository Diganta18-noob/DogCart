import React, { useState, useEffect } from 'react';
import api, { endpoints } from '../apiConfig';
import { toast } from 'react-toastify';
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
            toast.error('Failed to load orders.');
        } finally {
            setLoading(false);
        }
    };

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
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
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
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status.');
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
            case 'Pending': return 'badge-warning';
            case 'Confirmed': return 'badge-info';
            case 'OutForDelivery': return 'badge-secondary';
            case 'Delivered': return 'badge-success';
            case 'Cancelled': return 'badge-error';
            default: return 'badge-ghost';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
                <span className="loading loading-ring loading-lg text-primary"></span>
                <p className="text-slate-400 font-medium">Loading orders log...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 relative overflow-hidden bg-grid-pattern pt-24 pb-16 px-4 md:px-8">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 right-1/12 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
            <div className="absolute bottom-1/4 left-1/12 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-float"></div>

            <div className="max-w-5xl mx-auto flex flex-col gap-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-200/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-lg">
                    <div>
                        <h1 className="text-3xl font-bold font-outfit text-gradient-primary">
                            📦 Orders Placed
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Review checkout list, trace customer addresses, and update shipment status.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-base-200/30 p-4 rounded-2xl border border-white/5">
                    <div className="relative w-full sm:col-span-2">
                        <input
                            type="text"
                            placeholder="Search by Order ID or customer username..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="input-premium pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                    </div>

                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select-premium">
                        <option value="date">Sort by Date</option>
                        <option value="total">Sort by Total Charged</option>
                    </select>
                </div>

                {/* Orders Grid/List */}
                {paginatedOrders.length === 0 ? (
                    <div className="glass-card p-12 text-center flex flex-col items-center gap-3 border-white/5 bg-base-200/50">
                        <span className="text-5xl">📦</span>
                        <p className="text-slate-300 font-bold text-lg">No orders logged.</p>
                        <p className="text-slate-500 text-sm">Customers haven't checked out yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {paginatedOrders.map(order => {
                            const orderItems = getOrderItems(order);
                            return (
                                <div key={order._id} className="glass-card p-6 border-white/5 bg-base-200/50 flex flex-col gap-5 transition-all duration-300 hover:border-primary/10">
                                    {/* Card Header */}
                                    <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-white/5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-slate-500 font-semibold uppercase">Order ID</span>
                                            <span className="text-sm font-bold text-white tracking-wider">#{order._id.slice(-12).toUpperCase()}</span>
                                        </div>
                                        <span className={`badge ${getStatusColor(order.orderStatus)} font-bold text-xs uppercase px-2.5 py-1`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-slate-500 font-semibold uppercase">Customer</span>
                                            <span className="text-slate-300 font-medium">{order.user?.username || 'Unknown'}</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-slate-500 font-semibold uppercase">Placed On</span>
                                            <span className="text-slate-300 font-medium">{formatDate(order.orderDate)}</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-slate-500 font-semibold uppercase">Total Amount</span>
                                            <span className="font-extrabold text-primary">₹{order.totalAmount?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-slate-500 font-semibold uppercase">Item Count</span>
                                            <span className="text-slate-300 font-medium">{order.orderItems?.length || 0} pet(s)</span>
                                        </div>
                                    </div>

                                    {/* Preview List */}
                                    <div className="flex flex-col gap-3 bg-base-300/30 p-4 rounded-xl border border-white/5">
                                        {orderItems.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 text-xs">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-base-200 flex-shrink-0 border border-white/5">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.src = DEFAULT_PET_IMAGE; }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex gap-2 items-center">
                                                        <span className="font-semibold text-slate-300">Pet:</span>
                                                        <span className="font-bold text-slate-200 truncate">{item.name}</span>
                                                    </div>
                                                    <span className="text-[10px] text-slate-500">Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {orderItems.length > 3 && (
                                            <div className="text-[10px] font-semibold text-slate-400 pl-14">
                                                +{orderItems.length - 3} more pet(s)...
                                            </div>
                                        )}
                                    </div>

                                    {/* Shipping Summary */}
                                    <div className="text-xs text-slate-400 bg-base-300/10 p-3 rounded-lg border border-white/5">
                                        <p><strong>Shipping:</strong> {order.shippingAddress || 'N/A'}</p>
                                    </div>

                                    {/* Control Row */}
                                    <div className="flex flex-wrap justify-between items-center gap-4 pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-400 font-semibold">Status:</span>
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="select select-bordered select-xs w-36 bg-base-300 border-white/10 rounded-lg text-xs"
                                            >
                                                {orderStatuses.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewItems(order)}
                                                className="btn btn-xs btn-outline border-white/10 hover:bg-white/5 text-slate-300 rounded-lg"
                                            >
                                                View Items
                                            </button>
                                            <button
                                                onClick={() => handleViewProfile(order.user)}
                                                className="btn btn-xs btn-ghost text-slate-400 hover:text-white rounded-lg"
                                                disabled={!order.user}
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
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="btn btn-sm btn-outline border-white/10 text-slate-300 disabled:opacity-30 rounded-xl"
                        >
                            ⬅ Prev
                        </button>
                        <span className="text-sm font-semibold text-slate-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="btn btn-sm btn-outline border-white/10 text-slate-300 disabled:opacity-30 rounded-xl"
                        >
                            Next ➡
                        </button>
                    </div>
                )}
            </div>

            {/* View Items Modal */}
            {showItemsModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowItemsModal(false)}>
                    <div className="glass-card max-w-md w-full p-6 mx-4 animate-scale-in border border-white/10 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                            <h3 className="text-xl font-bold font-outfit text-gradient-primary">Ordered Items</h3>
                            <button className="btn btn-ghost btn-circle btn-sm text-slate-400 hover:text-white" onClick={() => setShowItemsModal(false)}>✕</button>
                        </div>

                        <div className="flex flex-col gap-3 max-h-[30vh] overflow-y-auto pr-1">
                            {getOrderItems(selectedOrder).map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center bg-base-300/40 p-3 rounded-xl border border-white/5">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                                        onError={(e) => { e.target.src = DEFAULT_PET_IMAGE; }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <span className="font-bold text-slate-200 block truncate text-sm">{item.name}</span>
                                        <span className="text-xs text-slate-400">x{item.quantity}</span>
                                    </div>
                                    <span className="font-semibold text-slate-300 text-sm">₹{item.price?.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                            <strong className="text-slate-300">Total Charged:</strong>
                            <span className="text-xl font-bold text-primary">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* View Profile Modal */}
            {showProfileModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowProfileModal(false)}>
                    <div className="glass-card max-w-sm w-full p-6 mx-4 animate-scale-in border border-white/10 flex flex-col gap-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                            <h3 className="text-xl font-bold font-outfit text-gradient-primary">Customer Profile</h3>
                            <button className="btn btn-ghost btn-circle btn-sm text-slate-400 hover:text-white" onClick={() => setShowProfileModal(false)}>✕</button>
                        </div>

                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="avatar placeholder">
                                <div className="bg-primary/20 text-primary rounded-full w-16 h-16 font-extrabold text-2xl uppercase">
                                    {selectedUser.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 w-full text-sm text-slate-300">
                                <div className="flex justify-between py-1.5 border-b border-white/5">
                                    <span className="text-slate-500 font-semibold uppercase text-xs">Username</span>
                                    <span className="font-medium">{selectedUser.username}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-white/5">
                                    <span className="text-slate-500 font-semibold uppercase text-xs">Email</span>
                                    <span className="font-medium">{selectedUser.email}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-slate-500 font-semibold uppercase text-xs">Mobile</span>
                                    <span className="font-medium">{selectedUser.mobileNumber || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderPlaced;
