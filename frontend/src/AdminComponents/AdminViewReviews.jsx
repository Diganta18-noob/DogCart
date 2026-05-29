import React, { useState, useEffect } from 'react';
import api, { endpoints } from '../apiConfig';
import { toast } from 'react-toastify';
import './AdminViewReviews.css';

const AdminViewReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [showPetModal, setShowPetModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 6;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const reviewsRes = await api.get(endpoints.reviews);
            setReviews(reviewsRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load reviews.');
        } finally {
            setLoading(false);
        }
    };

    const filteredReviews = reviews.filter(review => {
        const dogName = review.dog?.dogName || '';
        const username = review.user?.username || '';
        return dogName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            username.toLowerCase().includes(searchTerm.toLowerCase());
    }).sort((a, b) => {
        if (sortBy === 'date') {
            const dateA = new Date(a.date || 0);
            const dateB = new Date(b.date || 0);
            return dateB - dateA;
        }
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
    });

    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const paginatedReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage);

    const handleViewPet = (dog) => {
        if (dog) {
            setSelectedPet(dog);
            setShowPetModal(true);
        } else {
            toast.info('Pet details are not available.');
        }
    };

    const handleViewProfile = (user) => {
        if (user) {
            setSelectedUser(user);
            setShowProfileModal(true);
        } else {
            toast.info('Customer details are not available.');
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} className="text-sm">
                        {s <= rating ? '★' : '☆'}
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
                <span className="loading loading-ring loading-lg text-primary"></span>
                <p className="text-slate-400 font-medium">Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 relative overflow-hidden bg-grid-pattern pt-24 pb-16 px-4 md:px-8">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 right-1/12 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
            <div className="absolute bottom-1/4 left-1/12 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-float"></div>

            <div className="max-w-5xl mx-auto flex flex-col gap-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-200/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-lg">
                    <div>
                        <h1 className="text-3xl font-bold font-outfit text-gradient-primary">
                            💬 Reviews & Feedback
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Monitor adoption feedback, ratings, and customer stories.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-base-200/30 p-4 rounded-2xl border border-white/5">
                    <div className="relative w-full sm:col-span-2">
                        <input
                            type="text"
                            placeholder="Search by pet name or customer username..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="input-premium pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                    </div>

                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select-premium">
                        <option value="date">Sort by Date: Latest</option>
                        <option value="rating">Sort by Rating: High</option>
                    </select>
                </div>

                {/* Reviews list */}
                {filteredReviews.length === 0 ? (
                    <div className="glass-card p-12 text-center flex flex-col items-center gap-3 border-white/5 bg-base-200/50">
                        <span className="text-5xl">⭐</span>
                        <p className="text-slate-300 font-bold text-lg">No reviews found.</p>
                        <p className="text-slate-500 text-sm">Feedback is empty.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paginatedReviews.map(review => (
                            <div key={review._id || review.id} className="glass-card p-6 border-white/5 bg-base-200/50 flex flex-col justify-between gap-4 transition-all duration-300 hover:border-primary/10">
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold font-outfit text-white">{review.dog?.dogName || 'Unknown Pet'}</h3>
                                            <span className="text-[10px] text-slate-500 font-medium">Date: {new Date(review.date).toLocaleDateString('en-GB')}</span>
                                        </div>
                                        {renderStars(review.rating)}
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed bg-base-300/20 p-3 rounded-xl border border-white/5">{review.reviewText}</p>
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
                                    <button
                                        onClick={() => handleViewPet(review.dog)}
                                        className="btn btn-xs btn-outline border-white/10 hover:bg-white/5 text-slate-300 rounded-lg"
                                    >
                                        View Pet
                                    </button>
                                    <button
                                        onClick={() => handleViewProfile(review.user)}
                                        className="btn btn-xs btn-ghost text-slate-400 hover:text-white rounded-lg"
                                        disabled={!review.user}
                                    >
                                        View Customer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="btn btn-sm btn-outline border-white/10 text-slate-300 disabled:opacity-30 rounded-xl"
                        >
                            ⬅ Prev
                        </button>
                        <span className="text-sm font-semibold text-slate-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="btn btn-sm btn-outline border-white/10 text-slate-300 disabled:opacity-30 rounded-xl"
                        >
                            Next ➡
                        </button>
                    </div>
                )}
            </div>

            {/* View Pet Modal */}
            {showPetModal && selectedPet && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowPetModal(false)}>
                    <div className="glass-card max-w-sm w-full overflow-hidden animate-scale-in border border-white/10" onClick={(e) => e.stopPropagation()}>
                        <div className="h-48 relative bg-base-300">
                            {selectedPet.coverImage ? (
                                <img src={selectedPet.coverImage} alt={selectedPet.dogName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl text-slate-600 bg-slate-800">🐾</div>
                            )}
                            <button className="btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 border-0 absolute top-3 right-3 text-slate-300" onClick={() => setShowPetModal(false)}>✕</button>
                        </div>
                        <div className="p-6 flex flex-col gap-3">
                            <h3 className="text-xl font-bold font-outfit text-white">{selectedPet.dogName}</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm mt-1 text-slate-300">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Breed</span>
                                    <span className="font-medium">{selectedPet.breed}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Category</span>
                                    <span className="font-medium">{selectedPet.category}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Adoption Fee</span>
                                    <span className="text-primary font-bold">₹{selectedPet.price?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Profile Modal */}
            {showProfileModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowProfileModal(false)}>
                    <div className="glass-card max-w-sm w-full p-6 mx-4 animate-scale-in border border-white/10 flex flex-col gap-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                            <h3 className="text-xl font-bold font-outfit text-gradient-primary">Customer Details</h3>
                            <button className="btn btn-ghost btn-circle btn-sm text-slate-400 hover:text-white" onClick={() => setShowProfileModal(false)}>✕</button>
                        </div>

                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="avatar placeholder">
                                <div className="bg-primary/20 text-primary rounded-full w-16 h-16 font-extrabold text-2xl uppercase">
                                    {selectedUser.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 w-full text-sm text-slate-300">
                                <div className="flex justify-between py-1.5 border-b border-white/5">
                                    <span className="text-slate-500 font-semibold uppercase text-xs">Username</span>
                                    <span className="font-medium">{selectedUser.username}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-white/5">
                                    <span className="text-slate-500 font-semibold uppercase text-xs">Email</span>
                                    <span className="font-medium">{selectedUser.email}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-slate-500 font-semibold uppercase text-xs">Mobile</span>
                                    <span className="font-medium">{selectedUser.mobileNumber || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminViewReviews;
