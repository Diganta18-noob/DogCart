import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal, clearCart } from '../cartSlice';
import { selectUser } from '../userSlice';
import api, { endpoints } from '../apiConfig';
import { toast } from 'react-toastify';
import './Checkout.css';

const DEFAULT_PET_IMAGE = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const user = useSelector(selectUser);
    const [shippingAddress, setShippingAddress] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePlaceOrder = async () => {
        if (!shippingAddress || !billingAddress) {
            toast.warning('Please fill in all address fields');
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            user: user?.id,
            orderItems: items.map(item => ({
                dog: item.id,
                quantity: item.quantity
            })),
            shippingAddress: shippingAddress,
            billingAddress: billingAddress
        };

        try {
            await api.post(endpoints.orders, orderData);
            setShowSuccess(true);
            toast.success('Order placed successfully!');
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessClose = () => {
        dispatch(clearCart());
        navigate('/my-orders');
    };

    if (items.length === 0 && !showSuccess) {
        return (
            <div className="min-h-screen bg-base-100 relative overflow-hidden bg-grid-pattern pt-24 pb-16 px-4 flex items-center justify-center">
                <div className="glass-card max-w-md w-full p-8 text-center flex flex-col items-center gap-4">
                    <span className="text-5xl animate-bounce">🛒</span>
                    <h2 className="text-2xl font-bold font-outfit text-white">Your cart is empty</h2>
                    <p className="text-slate-400 text-sm">Add some pets to your cart before checking out.</p>
                    <button onClick={() => navigate('/pets')} className="btn btn-gradient-primary rounded-xl text-white mt-2 w-full">
                        Browse Pets
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 relative overflow-hidden bg-grid-pattern pt-24 pb-16 px-4 md:px-8">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
            <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-float"></div>

            <div className="max-w-5xl mx-auto flex flex-col gap-8 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-gradient-primary">
                        📝 Checkout Summary
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Review your invoice details and enter the shipping information.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Invoice Summary */}
                    <div className="lg:col-span-7 glass-card p-6 md:p-8 flex flex-col gap-6 border-white/5 bg-base-200/50">
                        <h2 className="text-xl font-bold font-outfit text-slate-200 pb-3 border-b border-white/5 flex items-center gap-2">
                            <span>📄 Invoice</span>
                        </h2>

                        <div className="flex flex-col gap-4 overflow-y-auto max-h-[350px] pr-2">
                            {items.map(item => (
                                <div key={item.id} className="flex gap-4 items-center bg-base-300/30 p-4 rounded-xl border border-white/5">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-base-200 flex-shrink-0 border border-white/5">
                                        <img
                                            src={item.image || DEFAULT_PET_IMAGE}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = DEFAULT_PET_IMAGE; }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-200 truncate text-sm">{item.name}</h4>
                                        <div className="flex gap-4 text-xs text-slate-400 mt-0.5">
                                            <span>Qty: {item.quantity}</span>
                                            <span>Price: ₹{item.price?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <span className="font-bold text-slate-100 text-sm">
                                        ₹{(item.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/5 text-lg">
                            <span className="font-semibold text-slate-300">Total Amount:</span>
                            <span className="text-2xl font-extrabold font-outfit text-primary">₹{total.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Delivery Form */}
                    <div className="lg:col-span-5 glass-card p-6 md:p-8 flex flex-col gap-6 border-white/5 bg-base-200/50">
                        <h2 className="text-xl font-bold font-outfit text-slate-200 pb-3 border-b border-white/5">
                            🚚 Delivery Details
                        </h2>

                        <div className="flex flex-col gap-4">
                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-slate-300">Shipping Address*</span>
                                </label>
                                <textarea
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Enter complete shipping details"
                                    className="textarea-premium h-20"
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-slate-300">Billing Address*</span>
                                </label>
                                <textarea
                                    value={billingAddress}
                                    onChange={(e) => setBillingAddress(e.target.value)}
                                    placeholder="Enter complete billing details"
                                    className="textarea-premium h-20"
                                />
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="btn btn-gradient-primary w-full mt-2 text-white font-bold uppercase tracking-wider rounded-xl"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-xs"></span>
                                        Placing Order...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card max-w-md w-full p-8 mx-4 text-center flex flex-col items-center gap-4 animate-scale-in border border-white/10">
                        <div className="w-16 h-16 rounded-full bg-success/15 border border-success/30 text-success flex items-center justify-center text-3xl font-bold shadow-lg shadow-success/10 animate-bounce">
                            ✓
                        </div>
                        <h3 className="text-2xl font-bold font-outfit text-gradient-primary">Order Placed!</h3>
                        <p className="text-slate-300 text-sm">
                            Thank you for your order. Your purchase has been successfully processed.
                        </p>
                        <button onClick={handleSuccessClose} className="btn btn-success text-white w-full rounded-xl mt-2 font-semibold">
                            View My Orders
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
