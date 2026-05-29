import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-base-100 bg-grid-pattern px-4">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-error/15 rounded-full blur-[100px] pointer-events-none animate-pulse-glow"></div>
            
            <div className="relative z-10 glass-card max-w-md w-full p-8 text-center flex flex-col items-center gap-5 border-white/5 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-error/15 border border-error/20 text-error flex items-center justify-center text-3xl font-bold shadow-lg shadow-error/10 animate-bounce">
                    ⚠️
                </div>
                <h1 className="text-2xl font-extrabold font-outfit text-white">Oops! Something Went Wrong</h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link to="/" className="btn btn-gradient-primary w-full rounded-xl text-white font-semibold mt-2">
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
