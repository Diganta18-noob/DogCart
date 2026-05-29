import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectUser } from '../userSlice';
import api, { endpoints } from '../apiConfig';
import { toast } from 'react-toastify';
import './UserMyReview.css';

const EMOJI_RATINGS = [
    { value: 1, emoji: '😡', label: 'Terrible' },
    { value: 2, emoji: '😢', label: 'Bad' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '😊', label: 'Good' },
    { value: 5, emoji: '😍', label: 'Amazing' },
];

const UserMyReview = () => {
    const user = useSelector(selectUser);
    const location = useLocation();
    const [reviews, setReviews] = useState([]);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [showPetModal, setShowPetModal] = useState(false);
    const [selectedPetForView, setSelectedPetForView] = useState(null);

    // Form state
    const [selectedPetId, setSelectedPetId] = useState(location.state?.petId || '');
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [formError, setFormError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch pets for dropdown
            const petsRes = await api.get(endpoints.pets);
            setPets(petsRes.data || []);

            // Fetch user's reviews
            if (user?.id) {
                try {
                    const reviewsRes = await api.get(endpoints.reviewsByUser(user.id));
                    setReviews(reviewsRes.data || []);
                } catch (error) {
                    if (error.response?.status === 404) {
                        setReviews([]);
                    } else {
                        console.error('Error fetching reviews:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setFormError('');
        setSubmitSuccess('');

        if (!selectedPetId) {
            setFormError('Please select a pet');
            return;
        }
        if (rating === 0) {
            setFormError('Please select a rating');
            return;
        }
        if (reviewText.trim().length < 10) {
            setFormError('Review must be at least 10 characters');
            return;
        }

        const reviewData = {
            user: user?.id,
            dog: selectedPetId,
            rating: rating,
            reviewText: reviewText.trim()
        };

        try {
            await api.post(endpoints.reviews, reviewData);
            setSubmitSuccess('Review submitted successfully!');
            toast.success('Review submitted successfully!');
            setSelectedPetId('');
            setRating(0);
            setReviewText('');
            fetchData();
            setTimeout(() => setSubmitSuccess(''), 3000);
        } catch (error) {
            console.error('Error submitting review:', error);
            setFormError(error.response?.data?.message || 'Failed to submit review');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`${endpoints.reviews}/${reviewToDelete._id}`);
            setReviews(reviews.filter(r => r._id !== reviewToDelete._id));
            toast.success('Review deleted successfully.');
        } catch (error) {
            console.error('Error deleting review:', error);
            setReviews(reviews.filter(r => r._id !== reviewToDelete._id));
        }
        setShowDeleteConfirm(false);
        setReviewToDelete(null);
    };

    const handleViewPet = (dog) => {
        if (dog) {
            setSelectedPetForView(dog);
            setShowPetModal(true);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
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
            <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
            <div className="absolute bottom-1/4 right-1/10 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-float"></div>

            <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-gradient-primary">
                        ✎ Reviews & Feedback
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Submit your pet adoption stories or manage past reviews.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Share Thoughts Form */}
                    <div className="lg:col-span-5 glass-card p-6 md:p-8 flex flex-col gap-5 border-white/5 bg-base-200/50">
                        <h2 className="text-xl font-bold font-outfit text-slate-200 pb-2 border-b border-white/5">
                            Share Your Thoughts
                        </h2>
                        
                        <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-slate-300">Select Pet</span>
                                </label>
                                <select
                                    value={selectedPetId}
                                    onChange={(e) => setSelectedPetId(e.target.value)}
                                    className="select-premium"
                                >
                                    <option value="">Choose a pet...</option>
                                    {pets.map(pet => (
                                        <option key={pet._id} value={pet._id}>{pet.dogName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-slate-300">How was your experience?</span>
                                </label>
                                <div className="flex justify-around bg-base-300/30 p-3 rounded-2xl border border-white/5">
                                    {EMOJI_RATINGS.map(item => (
                                        <button
                                            key={item.value}
                                            type="button"
                                            className={`text-2xl p-2 rounded-xl transition-all duration-200 ${rating === item.value ? 'bg-primary/20 scale-125 border border-primary/20' : 'hover:scale-110 opacity-70'}`}
                                            onClick={() => setRating(item.value)}
                                            title={item.label}
                                        >
                                            {item.emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text font-medium text-slate-300">Your Review</span>
                                </label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Tell us about your pet..."
                                    rows="4"
                                    className="textarea-premium"
                                />
                            </div>

                            {formError && (
                                <div className="alert alert-error bg-error/10 border-error/20 text-error text-xs rounded-xl p-3 flex gap-2 items-center">
                                    <span>{formError}</span>
                                </div>
                            )}

                            {submitSuccess && (
                                <div className="alert alert-success bg-success/10 border-success/20 text-success text-xs rounded-xl p-3 flex gap-2 items-center">
                                    <span>{submitSuccess}</span>
                                </div>
                            )}

                            <button type="submit" className="btn btn-gradient-primary w-full mt-2 text-white font-bold rounded-xl uppercase">
                                Submit Review
                            </button>
                        </form>
                    </div>

                    {/* My Thoughts List */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <h2 className="text-xl font-bold font-outfit text-slate-200 pb-2 border-b border-white/5">
                            My Reviews ({reviews.length})
                        </h2>

                        {reviews.length === 0 ? (
                            <div className="glass-card p-12 text-center flex flex-col items-center gap-4 border-white/5 bg-base-200/50">
                                <span className="text-5xl">📝</span>
                                <p className="text-slate-300 font-bold text-lg">No reviews written yet.</p>
                                <p className="text-slate-500 text-sm">Write reviews for adopted dogs to display them here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {reviews.map(review => (
                                    <div key={review._id} className="glass-card p-5 border-white/5 bg-base-200/50 flex flex-col gap-3 transition-all duration-300 hover:border-primary/10">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold font-outfit text-white">{review.dog?.dogName || 'Unknown Pet'}</h3>
                                                <span className="text-[10px] text-slate-500 font-medium">Reviewed on: {formatDate(review.date)}</span>
                                            </div>
                                            {renderStars(review.rating)}
                                        </div>
                                        
                                        <p className="text-slate-300 text-sm leading-relaxed bg-base-300/20 p-3 rounded-xl border border-white/5">{review.reviewText}</p>
                                        
                                        <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                                            <button
                                                onClick={() => handleViewPet(review.dog)}
                                                className="btn btn-xs btn-outline border-white/10 hover:bg-white/5 text-slate-300 rounded-lg"
                                            >
                                                View Pet
                                            </button>
                                            <button
                                                onClick={() => { setReviewToDelete(review); setShowDeleteConfirm(true); }}
                                                className="btn btn-xs btn-ghost text-slate-500 hover:text-error hover:bg-error/10 rounded-lg"
                                            >
                                                Delete Review
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* View Pet Modal */}
            {showPetModal && selectedPetForView && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowPetModal(false)}>
                    <div className="glass-card max-w-sm w-full overflow-hidden animate-scale-in border border-white/10" onClick={(e) => e.stopPropagation()}>
                        <div className="h-48 relative bg-base-300">
                            {selectedPetForView.coverImage ? (
                                <img src={selectedPetForView.coverImage} alt={selectedPetForView.dogName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl text-slate-600 bg-slate-800">🐾</div>
                            )}
                            <button className="btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 border-0 absolute top-3 right-3 text-slate-300" onClick={() => setShowPetModal(false)}>✕</button>
                        </div>
                        <div className="p-6 flex flex-col gap-3">
                            <h3 className="text-xl font-bold font-outfit text-white">{selectedPetForView.dogName}</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm mt-1">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Breed</span>
                                    <span className="text-slate-300 font-medium">{selectedPetForView.breed}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Category</span>
                                    <span className="text-slate-300 font-medium">{selectedPetForView.category}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Adoption Fee</span>
                                    <span className="text-primary font-bold">₹{selectedPetForView.price?.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Age</span>
                                    <span className="text-slate-300 font-medium">{selectedPetForView.age}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card max-w-sm w-full p-6 mx-4 flex flex-col gap-4 animate-scale-in border border-white/10">
                        <h3 className="text-xl font-bold text-gradient-primary">Delete Review?</h3>
                        <p className="text-slate-300 text-sm">Are you sure you want to delete this review? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-ghost btn-sm rounded-lg">Cancel</button>
                            <button onClick={handleDelete} className="btn btn-error btn-sm rounded-lg text-white">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMyReview;
