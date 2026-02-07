import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { mockUsers } from '../mockData';
import forgotPasswordImage from '../assets/images/forgotpassword.png';
import './ForgotPassword.css';

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email').required('Email is required'),
    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords do not match').required('Confirm password is required'),
});

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);
    const [verifyError, setVerifyError] = useState('');
    const [verifySuccess, setVerifySuccess] = useState('');

    const handleVerifyEmail = (email) => {
        setVerifyError('');
        setVerifySuccess('');
        const user = mockUsers.find((u) => u.email === email);
        if (user) {
            setIsVerified(true);
            setVerifySuccess('Email verified! Please enter new password.');
        } else {
            setVerifyError('Email not found in our records');
        }
    };

    const handleSubmit = (values, { setSubmitting }) => {
        setTimeout(() => {
            alert('Password reset successful! Please login with your new password.');
            navigate('/login');
            setSubmitting(false);
        }, 500);
    };

    return (
        <div className="forgot-container">
            <div className="forgot-card">
                <div className="forgot-form-section">
                    <div className="forgot-icon">❤️</div>
                    <h1 className="forgot-title">Forgot Password</h1>
                    <p className="forgot-subtitle">Enter your email to reset your password</p>

                    <Formik initialValues={{ email: '', newPassword: '', confirmPassword: '' }} validationSchema={ForgotPasswordSchema} onSubmit={handleSubmit}>
                        {({ errors, touched, isSubmitting, values }) => (
                            <Form className="forgot-form">
                                <div className="form-group email-verify-group">
                                    <Field type="email" name="email" placeholder="example@gmail.com" className={`form-input ${errors.email && touched.email ? 'input-error' : ''}`} disabled={isVerified} />
                                    <button type="button" className="verify-button" onClick={() => handleVerifyEmail(values.email)} disabled={!values.email || isVerified}>
                                        {isVerified ? '✓' : 'Verify'}
                                    </button>
                                </div>
                                {errors.email && touched.email && <span className="error-message">{errors.email}</span>}
                                {verifyError && <span className="error-message">{verifyError}</span>}
                                {verifySuccess && <span className="success-message">{verifySuccess}</span>}

                                <div className="form-group">
                                    <label className="form-label">New Password*</label>
                                    <Field type="password" name="newPassword" placeholder="Enter new password" className={`form-input ${errors.newPassword && touched.newPassword ? 'input-error' : ''}`} disabled={!isVerified} />
                                    {errors.newPassword && touched.newPassword && <span className="error-message">{errors.newPassword}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Confirm New Password*</label>
                                    <Field type="password" name="confirmPassword" placeholder="Re-enter new password" className={`form-input ${errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}`} disabled={!isVerified} />
                                    {errors.confirmPassword && touched.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                </div>

                                <button type="submit" className="reset-button" disabled={!isVerified || isSubmitting}>
                                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                                </button>
                                <p className="back-to-login">Remembered your password? <Link to="/login">Login</Link></p>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="forgot-image-section">
                    <img src={forgotPasswordImage} alt="Forgot password illustration" />
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
