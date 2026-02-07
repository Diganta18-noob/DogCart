import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
    return (
        <div className="error-container">
            <div className="error-content">
                <div className="error-icon">⚠️</div>
                <h1 className="error-title">Oops! Something Went Wrong</h1>
                <p className="error-subtitle">Please try again later.</p>
                <Link to="/" className="error-button">
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
