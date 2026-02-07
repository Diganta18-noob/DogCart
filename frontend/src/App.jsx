import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectRole } from './userSlice';

// Components
import Login from './Components/Login';
import Signup from './Components/Signup';
import ForgotPassword from './Components/ForgotPassword';
import HomePage from './Components/HomePage';
import ErrorPage from './Components/ErrorPage';

// Admin Components
import AdminNav from './AdminComponents/AdminNav';
import Dashboard from './AdminComponents/Dashboard';
import AdminViewPets from './AdminComponents/AdminViewPets';
import PetForm from './AdminComponents/PetForm';
import OrderPlaced from './AdminComponents/OrderPlaced';
import AdminViewReviews from './AdminComponents/AdminViewReviews';

// User Components
import UserNav from './UserComponents/UserNav';
import UserViewPets from './UserComponents/UserViewPets';
import UserViewOrders from './UserComponents/UserViewOrders';
import UserMyReview from './UserComponents/UserMyReview';
import Checkout from './UserComponents/Checkout';
import Cart from './UserComponents/Cart';

import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const role = useSelector(selectRole);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/error" replace />;
    }

    return children;
};

const AdminLayout = ({ children }) => (
    <>
        <AdminNav />
        <main className="main-content">{children}</main>
    </>
);

const UserLayout = ({ children }) => (
    <>
        <UserNav />
        <main className="main-content">{children}</main>
        <Cart />
    </>
);

function App() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const role = useSelector(selectRole);

    return (
        <div className="App">
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
                <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/error" element={<ErrorPage />} />

                {/* Home Route */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            {role === 'admin' ? (
                                <AdminLayout><HomePage /></AdminLayout>
                            ) : (
                                <UserLayout><HomePage /></UserLayout>
                            )}
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/pets" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminViewPets /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/pets/add" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><PetForm /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/pets/edit/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><PetForm isEdit /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><OrderPlaced /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/reviews" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminViewReviews /></AdminLayout></ProtectedRoute>} />

                {/* User Routes */}
                <Route path="/pets" element={<ProtectedRoute allowedRoles={['user']}><UserLayout><UserViewPets /></UserLayout></ProtectedRoute>} />
                <Route path="/my-orders" element={<ProtectedRoute allowedRoles={['user']}><UserLayout><UserViewOrders /></UserLayout></ProtectedRoute>} />
                <Route path="/my-reviews" element={<ProtectedRoute allowedRoles={['user']}><UserLayout><UserMyReview /></UserLayout></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute allowedRoles={['user']}><UserLayout><Checkout /></UserLayout></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;
