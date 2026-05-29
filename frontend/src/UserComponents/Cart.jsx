import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal, selectIsCartOpen, closeCart, removeFromCart, updateQuantity, clearCart } from '../cartSlice';
import './Cart.css';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const isOpen = useSelector(selectIsCartOpen);

    const handleCheckout = () => {
        dispatch(closeCart());
        navigate('/checkout');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" 
                onClick={() => dispatch(closeCart())} 
            />
            
            {/* Sidebar Container */}
            <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-base-200/95 backdrop-blur-xl border-l border-white/5 shadow-2xl flex flex-col animate-slide-in-right">
                
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-base-300/40">
                    <h2 className="text-xl font-bold font-outfit text-gradient-primary flex items-center gap-2">
                        <span>🛒 Your Cart</span>
                        {items.length > 0 && (
                            <span className="badge badge-primary badge-sm font-semibold">
                                {items.reduce((sum, item) => sum + item.quantity, 0)}
                            </span>
                        )}
                    </h2>
                    <button 
                        className="btn btn-ghost btn-circle btn-sm text-slate-400 hover:text-white" 
                        onClick={() => dispatch(closeCart())}
                    >
                        ✕
                    </button>
                </div>

                {/* Items List / Empty State */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                    {items.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center opacity-65">
                            <span className="text-5xl">🛒</span>
                            <p className="text-slate-300 font-bold text-lg">Your cart is empty</p>
                            <p className="text-slate-500 text-sm">Add some furry friends to get started!</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="p-4 bg-base-300/40 rounded-2xl border border-white/5 flex gap-4 items-center">
                                {/* Item Image */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-base-200 flex-shrink-0 border border-white/5">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">🐾</div>
                                    )}
                                </div>

                                {/* Item Details */}
                                <div className="flex-1 flex flex-col gap-1 min-w-0">
                                    <h4 className="font-bold text-slate-100 truncate text-sm md:text-base">{item.name}</h4>
                                    <p className="text-xs text-primary font-bold">₹{item.price?.toLocaleString()}</p>
                                    
                                    {/* Quantity Select */}
                                    <div className="flex items-center gap-1 mt-1">
                                        <button 
                                            className="btn btn-square btn-xs btn-neutral bg-white/5 border-white/10 text-slate-300 rounded-md"
                                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center text-xs font-semibold text-slate-200">{item.quantity}</span>
                                        <button 
                                            className="btn btn-square btn-xs btn-neutral bg-white/5 border-white/10 text-slate-300 rounded-md"
                                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                            disabled={item.quantity >= item.stockQuantity}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button 
                                    className="btn btn-ghost btn-circle btn-sm text-slate-400 hover:text-error hover:bg-error/10"
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Controls */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-white/5 bg-base-300/40 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">Estimated Total:</span>
                            <span className="text-2xl font-extrabold font-outfit text-white">₹{total.toLocaleString()}</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                            <button 
                                className="btn btn-outline btn-sm border-white/10 hover:border-white/20 text-slate-400 rounded-xl"
                                onClick={() => dispatch(clearCart())}
                            >
                                Clear
                            </button>
                            <button 
                                className="btn btn-gradient-primary btn-sm col-span-2 text-white font-bold rounded-xl"
                                onClick={handleCheckout}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
