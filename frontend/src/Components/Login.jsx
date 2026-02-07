import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login } from '../userSlice';
import api, { endpoints } from '../apiConfig';
// import { mockUsers } from '../mockData'; // Removed mock data import
import loginBg from '../assets/images/loginphoto.jpg';
import logo from '../assets/images/logo.jpg';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginError, setLoginError] = useState('');
    const [loginState, setLoginState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

    const { register, handleSubmit, formState: { errors } } = useForm();

    // Get button text based on current login state
    const getButtonText = () => {
        switch (loginState) {
            case 'loading':
                return 'Logging in...';
            case 'success':
                return 'Authenticated ✓';
            case 'error':
                return 'Login Failed';
            default:
                return 'Login';
        }
    };

    const onSubmit = async (values) => {
        setLoginError('');
        setLoginState('loading');

        try {
            const response = await api.post(endpoints.login, values);
            const { user, token } = response.data;

            // Map backend user structure to frontend expectation if needed
            // Backend sends: { _id, username, email, mobileNumber, userRole }
            const mappedUser = {
                id: user._id,
                username: user.username,
                email: user.email,
                mobile: user.mobileNumber
            };

            setLoginState('success');

            // Brief delay to show success state before redirect
            setTimeout(() => {
                dispatch(login({
                    user: mappedUser,
                    role: user.userRole?.toLowerCase(), // normalize to lowercase for route guards
                    token: token,
                }));
                navigate('/');
            }, 500);
        } catch (error) {
            console.error('Login error:', error);
            setLoginState('error');
            setLoginError(error.response?.data?.message || 'Invalid email or password');

            // Reset to idle state after showing error
            setTimeout(() => setLoginState('idle'), 2000);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-image-section">
                    <img src={loginBg} alt="Pet illustration" className="login-bg-image" />
                </div>
                <div className="login-form-section">
                    <div className="login-form-content">
                        <div className="login-logo">
                            <img src={logo} alt="PawMart Logo" />
                        </div>
                        <h1 className="login-title">PawMart</h1>
                        <p className="login-subtitle">Login</p>

                        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                                {errors.email && <span className="error-message">{errors.email.message}</span>}
                            </div>

                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                />
                                {errors.password && <span className="error-message">{errors.password.message}</span>}
                            </div>

                            {loginError && <div className="login-error">{loginError}</div>}

                            <div className="forgot-password-link">
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>

                            <button
                                type="submit"
                                className={`login-button ${loginState !== 'idle' ? `login-button--${loginState}` : ''}`}
                                disabled={loginState === 'loading' || loginState === 'success'}
                            >
                                {loginState === 'loading' && <span className="login-spinner"></span>}
                                {getButtonText()}
                            </button>
                            <p className="signup-link">Don't have an account? <Link to="/signup">Signup</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
