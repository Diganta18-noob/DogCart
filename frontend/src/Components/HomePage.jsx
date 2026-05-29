import React from 'react';
import { useSelector } from 'react-redux';
import { selectRole, selectUser } from '../userSlice';
import { Link } from 'react-router-dom';
import pawmartCover from '../assets/images/pawmartcover.png';
import './HomePage.css';

const HomePage = () => {
    const role = useSelector(selectRole);
    const user = useSelector(selectUser);

    return (
        <div className="min-h-screen bg-base-100 relative overflow-hidden bg-grid-pattern pt-20 pb-16 px-4 md:px-8">
            {/* Ambient glows */}
            <div className="absolute top-1/4 left-1/12 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
            <div className="absolute bottom-1/4 right-1/12 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none animate-float"></div>

            <div className="max-w-6xl mx-auto flex flex-col gap-12 relative z-10">
                {/* Hero Showcase Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[300px] md:h-[450px] group border border-white/10">
                    {/* Background image with zoom */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] group-hover:scale-105"
                        style={{ backgroundImage: `url(${pawmartCover})` }}
                    ></div>
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>

                    {/* Content over image */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col justify-end gap-3">
                        <span className="text-xs uppercase tracking-widest font-extrabold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 w-fit">
                            Welcome to PawMart
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold font-outfit text-white leading-none">
                            Find Your Perfect <br className="hidden md:inline" />
                            <span className="text-gradient-primary">Furry Companion</span>
                        </h1>
                    </div>
                </div>

                {/* Main Content & Contact section grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Welcome card */}
                    <div className="lg:col-span-2 glass-card p-8 flex flex-col justify-between gap-6 border-white/5 bg-base-200/50">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-2xl font-bold font-outfit text-gradient-secondary">
                                Discover A Happier Pet Life
                            </h2>
                            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                Welcome to <strong>PawMart</strong>, your premier destination for finding loving, healthy, and happy pets. 
                                We are dedicated to providing a safe, clean, and interactive platform to connect pet seekers with their future best friends.
                            </p>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Explore our carefully curated list of dogs and puppies looking for a warm home. From loyal golden retrievers to playful puppies, find the ideal companion tailored to your lifestyle. Start your pet parenting journey with confidence!
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                            {role === 'admin' ? (
                                <Link to="/dashboard" className="btn btn-gradient-primary rounded-xl text-white">
                                    Admin Dashboard
                                </Link>
                            ) : (
                                <Link to="/pets" className="btn btn-gradient-primary rounded-xl text-white">
                                    Adopt a Pet
                                </Link>
                            )}
                            <a href="#contact" className="btn btn-outline border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl text-slate-300">
                                Contact Us
                            </a>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div id="contact" className="glass-card p-8 flex flex-col gap-6 border-white/5 bg-base-200/50">
                        <h2 className="text-2xl font-bold font-outfit text-gradient-accent">
                            Contact Us
                        </h2>
                        <div className="flex flex-col gap-5 text-sm">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Phone</span>
                                    <span className="text-slate-300 font-medium mt-0.5">+91 98765 43210</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Email</span>
                                    <span className="text-slate-300 font-medium mt-0.5">support@pawmart.com</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Address</span>
                                    <span className="text-slate-300 font-medium mt-0.5">123 Paw Street, Pet City, IN</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
