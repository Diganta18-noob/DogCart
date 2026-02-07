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
            <div className="cart-overlay" onClick={() => dispatch(closeCart())} />
            <div className="cart-sidebar">
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="close-cart-btn" onClick={() => dispatch(closeCart())}>✕</button>
                </div>

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <span className="empty-icon">🛒</span>
                        <p>Your cart is empty</p>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {items.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        {item.image ? <img src={item.image} alt={item.name} /> : <span>🐾</span>}
                                    </div>
                                    <div className="item-info">
                                        <h4>{item.name}</h4>
                                        <p className="item-price">₹{item.price.toLocaleString()}</p>
                                        <div className="item-quantity">
                                            <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</button>
                                        </div>
                                    </div>
                                    <button className="remove-item-btn" onClick={() => dispatch(removeFromCart(item.id))}>🗑️</button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-total">
                                <span>Total:</span>
                                <span className="total-amount">₹{total.toLocaleString()}</span>
                            </div>
                            <button className="clear-cart-btn" onClick={() => dispatch(clearCart())}>Clear Cart</button>
                            <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Cart;
