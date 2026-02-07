import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api, { endpoints } from '../apiConfig';
import loginBg from '../assets/images/loginphoto.jpg';
import logo from '../assets/images/logo.jpg';
import './Signup.css';
import { toast } from 'react-toastify';

const Signup = () => {
    const navigate = useNavigate();
    const [signupError, setSignupError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
    const password = watch("password", "");

    const onSubmit = async (values) => {
        setSignupError('');

        const payload = {
            username: values.username,
            email: values.email,
            mobileNumber: values.mobile,
            password: values.password,
            userRole: values.role
        };

        try {
            await api.post(endpoints.signup, payload);
            toast.success('Registration Successful! Please login.');
            navigate('/login');
            reset();
        } catch (error) {
            console.error('Signup error:', error);
            const errorMessage = error.response?.data?.message || 'Registration failed.';

            // Check for duplicate key error (MongoDB E11000)
            if (errorMessage.includes('E11000') || errorMessage.includes('duplicate')) {
                if (errorMessage.includes('email')) {
                    setSignupError('Email already exists');
                } else if (errorMessage.includes('username')) {
                    setSignupError('Username already exists');
                } else {
                    setSignupError('User already exists with these details');
                }
            } else {
                setSignupError(errorMessage);
            }
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-image-section">
                    <img src={loginBg} alt="Pet illustration" className="signup-bg-image" />
                </div>
                <div className="signup-form-section">
                    <div className="signup-form-content">
                        <div className="signup-logo">
                            <img src={logo} alt="PawMart Logo" />
                        </div>
                        <h1 className="signup-title">PawMart</h1>
                        <p className="signup-subtitle">Signup</p>

                        <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="User Name"
                                    className={`form-input ${errors.username ? 'input-error' : ''}`}
                                    {...register("username", { required: "User Name is required" })}
                                />
                                {errors.username && <span className="error-message">{errors.username.message}</span>}
                            </div>

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
                                    type="tel"
                                    placeholder="Mobile Number"
                                    className={`form-input ${errors.mobile ? 'input-error' : ''}`}
                                    {...register("mobile", {
                                        required: "Mobile number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Mobile number must be 10 digits"
                                        }
                                    })}
                                />
                                {errors.mobile && <span className="error-message">{errors.mobile.message}</span>}
                            </div>

                            <div className="form-group">
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
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
                                    <span
                                        className="password-toggle-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </span>
                                </div>
                                {errors.password && <span className="error-message">{errors.password.message}</span>}
                            </div>

                            <div className="form-group">
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                                        {...register("confirmPassword", {
                                            required: "Confirm Password is required",
                                            validate: value => value === password || "Passwords do not match"
                                        })}
                                    />
                                    <span
                                        className="password-toggle-icon"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </span>
                                </div>
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
                            </div>

                            <div className="form-group">
                                <select
                                    className={`form-input form-select ${errors.role ? 'input-error' : ''}`}
                                    {...register("role", { required: "Role is required" })}
                                >
                                    <option value="">Select Role</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && <span className="error-message">{errors.role.message}</span>}
                            </div>

                            {signupError && <div className="signup-error">{signupError}</div>}

                            <button type="submit" className="signup-button">
                                Submit
                            </button>
                            <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
                        </form>
                    </div>
                </div>
            </div>

            {/* Success Modal Removed - Using Toast */}
        </div>
    );
};

export default Signup;
