import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../userSlice';
import './AdminNav.css';

const AdminNav = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const activeStyle = "text-primary border-b-2 border-primary pb-1 font-semibold";
    const inactiveStyle = "text-slate-300 hover:text-white transition-colors duration-200";

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-40 bg-base-100/70 backdrop-blur-md border-b border-white/5">
                <div className="navbar max-w-7xl mx-auto px-4 md:px-8 min-h-[70px]">
                    {/* Left Brand */}
                    <div className="navbar-start">
                        <NavLink to="/" className="flex items-center gap-2">
                            <span className="text-2xl font-extrabold font-outfit text-gradient-primary tracking-tight">
                                PawMart <span className="text-xs uppercase px-2 py-0.5 rounded-md bg-primary/20 text-primary border border-primary/10 ml-1">Admin</span>
                            </span>
                        </NavLink>
                    </div>

                    {/* Middle Nav Links for Desktop */}
                    <div className="navbar-center hidden md:flex">
                        <ul className="flex gap-8 text-sm font-medium">
                            <li>
                                <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/pets" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                                    Pets
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/orders" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                                    Orders
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/reviews" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                                    Reviews
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* Right User actions */}
                    <div className="navbar-end gap-3">
                        <span className="hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                            {user?.username || 'demoadmin'} (Admin)
                        </span>

                        {/* Logout Button */}
                        <button className="btn btn-outline btn-error btn-sm rounded-xl px-4 hidden sm:inline-flex" onClick={handleLogoutClick}>
                            Logout
                        </button>

                        {/* Mobile Hamburguer */}
                        <button className="btn btn-ghost btn-circle btn-sm text-slate-300 md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-white/5 bg-base-200/90 backdrop-blur-lg py-4 px-6 animate-slide-up flex flex-col gap-4">
                        <ul className="flex flex-col gap-3 font-medium">
                            <li>
                                <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "text-primary font-bold" : "text-slate-300"}>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "text-primary font-bold" : "text-slate-300"}>
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/pets" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "text-primary font-bold" : "text-slate-300"}>
                                    Pets
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/orders" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "text-primary font-bold" : "text-slate-300"}>
                                    Orders
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/reviews" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "text-primary font-bold" : "text-slate-300"}>
                                    Reviews
                                </NavLink>
                            </li>
                        </ul>
                        <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                            <span className="text-xs text-slate-400">
                                Logged in as Admin: {user?.username || 'demoadmin'}
                            </span>
                            <button className="btn btn-error btn-sm w-full rounded-xl text-white mt-1" onClick={() => { setIsMobileMenuOpen(false); handleLogoutClick(); }}>
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card max-w-sm w-full p-6 mx-4 flex flex-col gap-4 animate-scale-in border border-white/10">
                        <h3 className="text-xl font-bold text-gradient-primary">Confirm Logout</h3>
                        <p className="text-slate-300 text-sm">Are you sure you want to log out of the admin panel?</p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button className="btn btn-ghost btn-sm rounded-lg" onClick={cancelLogout}>Cancel</button>
                            <button className="btn btn-error btn-sm rounded-lg text-white" onClick={confirmLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminNav;