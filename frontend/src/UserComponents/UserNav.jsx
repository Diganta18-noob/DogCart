import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser, selectRole } from '../userSlice';
import { selectCartItemCount, toggleCart } from '../cartSlice';
import './UserNav.css';

const UserNav = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const role = useSelector(selectRole);
    const cartCount = useSelector(selectCartItemCount);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        dispatch(logout());
        navigate('/login');
        setShowLogoutModal(false);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleCartClick = () => {
        dispatch(toggleCart());
    };

    return (
        <>
            <nav className="user-nav">
                <div className="nav-container">
                    <div className="nav-brand">
                        <span className="brand-text">PawMart</span>
                    </div>

                    <div className="nav-right-section">
                        <span className="user-info">
                            {user?.username || 'demouser'} / {role || 'User'}
                        </span>

                        <ul className="nav-links">
                            <li><NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink></li>
                            <li><NavLink to="/pets" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Pets</NavLink></li>
                            <li><NavLink to="/my-reviews" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Review</NavLink></li>
                        </ul>

                        <div className="nav-actions">
                            <button className="cart-btn" onClick={handleCartClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </button>
                            <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            {showLogoutModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <h3>Confirm Logout</h3>
                        <p>Are you sure you want to logout?</p>
                        <div className="logout-modal-actions">
                            <button className="modal-btn cancel" onClick={cancelLogout}>Cancel</button>
                            <button className="modal-btn confirm" onClick={confirmLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserNav;
