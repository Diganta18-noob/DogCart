import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../userSlice';
import api, { endpoints } from '../apiConfig';
import { toast } from 'react-toastify';
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
            if (error.response?.status === 404) {
                setOrders([]);
            } else {
                toast.error('Failed to fetch orders.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await api.put(endpoints.orderById(orderId), { orderStatus: 'Cancelled' });
            setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o));
            toast.success('Order cancelled successfully.');
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error('Unable to cancel order. Please contact support.');
        }
    };

    const handleTrackOrder = async (order) => {
        try {
            const response = await api.get(endpoints.orderById(order._id));
            const freshOrder = response.data;
            setTrackingOrder(freshOrder);
            setShowTrackModal(true);
            setOrders(orders.map(o => o._id === order._id ? freshOrder : o));
        } catch (error) {
            console.error('Error fetching order:', error);
            setTrackingOrder(order);
            setShowTrackModal(true);
        }
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
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
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

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
                <span className="loading loading-ring loading-lg text-primary"></span>
                <p className="text-slate-400 font-medium">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 relative overflow-hidden bg-grid-pattern pt-24 pb-16 px-4 md:px-8">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 right-1/12 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
            <div className="absolute bottom-1/4 left-1/12 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-float"></div>

            <div className="max-w-4xl mx-auto flex flex-col gap-8 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-gradient-primary">
                        📦 Order History
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Monitor shipments, print invoices, or manage purchases.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="glass-card p-12 text-center flex flex-col items-center gap-4 border-white/5 bg-base-200/50">
                        <span className="text-5xl">📦</span>
                        <p className="text-slate-300 font-bold text-lg">No orders placed yet.</p>
                        <p className="text-slate-500 text-sm">Explore our puppy listings and find your buddy!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orders.map(order => {
                            const orderItems = getOrderItems(order);
                            return (
                                <div key={order._id} className="glass-card p-6 border-white/5 bg-base-200/50 flex flex-col gap-5 transition-all duration-300 hover:border-primary/20">
                                    {/* Order Info Row */}
                                    <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-white/5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-slate-500 uppercase font-semibold">Order ID</span>
                                            <span className="text-sm font-bold text-white tracking-wider">#{order._id.slice(-12).toUpperCase()}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-400 font-medium">Placed on: {formatDate(order.orderDate)}</span>
                                            <span className={`badge ${getStatusColor(order.orderStatus)} font-bold text-xs uppercase px-2.5 py-1`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-slate-500 uppercase font-semibold">Total Invoice</span>
                                            <span className="text-lg font-extrabold text-primary">₹{order.totalAmount?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 md:col-span-2">
                                            <span className="text-xs text-slate-500 uppercase font-semibold">Ship To</span>
                                            <span className="text-slate-300 truncate font-medium">{order.shippingAddress}</span>
                                        </div>
                                    </div>

                                    {/* Items Preview List */}
                                    <div className="flex flex-col gap-3 bg-base-300/30 p-4 rounded-xl border border-white/5">
                                        {orderItems.map((item, idx) => (
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
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5 justify-end">
                                        {order.orderStatus === 'Pending' && (
                                            <button
                                                onClick={() => handleCancelOrder(order._id)}
                                                className="btn btn-xs btn-error btn-outline rounded-lg text-xs"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="btn btn-xs btn-outline border-white/10 hover:bg-white/5 text-slate-300 rounded-lg"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleTrackOrder(order)}
                                            className="btn btn-xs btn-primary rounded-lg text-white font-bold px-4"
                                        >
                                            Track Status
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* View Items Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedOrder(null)}>
                    <div className="glass-card max-w-md w-full p-6 mx-4 animate-scale-in border border-white/10 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                            <h3 className="text-xl font-bold font-outfit text-gradient-primary">Order Invoices</h3>
                            <button className="btn btn-ghost btn-circle btn-sm text-slate-400 hover:text-white" onClick={() => setSelectedOrder(null)}>✕</button>
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

                        <div className="text-xs flex flex-col gap-2 pt-2 border-t border-white/5 text-slate-300">
                            <p><strong>Shipping:</strong> {selectedOrder.shippingAddress}</p>
                            <p><strong>Billing:</strong> {selectedOrder.billingAddress}</p>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                            <strong className="text-slate-300">Total Charged:</strong>
                            <span className="text-xl font-bold text-primary">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Track Status Stepper Modal */}
            {showTrackModal && trackingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowTrackModal(false)}>
                    <div className="glass-card max-w-xl w-full p-8 mx-4 animate-scale-in border border-white/10 flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                            <h3 className="text-xl font-bold font-outfit text-gradient-primary">
                                Track Shipment #{trackingOrder._id.slice(-8).toUpperCase()}
                            </h3>
                            <button className="btn btn-ghost btn-circle btn-sm text-slate-400 hover:text-white" onClick={() => setShowTrackModal(false)}>✕</button>
                        </div>

                        {trackingOrder.orderStatus === 'Cancelled' ? (
                            <div className="p-6 bg-error/10 border border-error/20 rounded-2xl flex flex-col items-center gap-2">
                                <span className="text-4xl text-error">❌</span>
                                <p className="text-slate-200 font-bold text-lg">Order Cancelled</p>
                                <p className="text-xs text-slate-400 text-center">This transaction has been terminated and will not be processed further.</p>
                            </div>
                        ) : (
                            <div className="py-4">
                                <ul className="steps steps-vertical md:steps-horizontal w-full">
                                    {getTrackingSteps(trackingOrder.orderStatus).map((step, index) => (
                                        <li 
                                            key={index} 
                                            className={`step text-xs ${step.completed ? 'step-primary text-primary font-bold' : 'text-slate-500'}`}
                                            data-content={step.completed ? '✓' : (index + 1)}
                                        >
                                            {step.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserViewOrders;
