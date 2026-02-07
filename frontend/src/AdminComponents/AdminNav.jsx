import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../userSlice';
import './AdminNav.css';

const AdminNav = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="admin-nav">
            <div className="nav-container">
                <div className="nav-brand">
                    <span className="brand-text">PawMart</span>
                </div>

                <div className="nav-right-section">
                    <span className="user-info">
                        {user?.username || 'demoadmin'} / Admin
                    </span>

                    <ul className="nav-links">
                        <li><NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink></li>
                        <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink></li>
                        <li><NavLink to="/admin/pets" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Pets</NavLink></li>
                        <li><NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Orders</NavLink></li>
                        <li><NavLink to="/admin/reviews" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Reviews</NavLink></li>
                    </ul>

                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNav;