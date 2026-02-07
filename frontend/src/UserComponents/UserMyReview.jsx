import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectUser } from '../userSlice';
import api, { endpoints } from '../apiConfig';
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
                    // 404 means no reviews found - that's ok
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

        // Backend expects: user, dog, reviewText, rating
        const reviewData = {
            user: user?.id,
            dog: selectedPetId,
            rating: rating,
            reviewText: reviewText.trim()
        };

        try {
            await api.post(endpoints.reviews, reviewData);
            setSubmitSuccess('Review submitted successfully!');
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
        } catch (error) {
            console.error('Error deleting review:', error);
            // Fallback to local state
            setReviews(reviews.filter(r => r._id !== reviewToDelete._id));
        }
        setShowDeleteConfirm(false);
        setReviewToDelete(null);
    };

    const handleViewPet = (dog) => {
        // dog is the populated dog object from the review
        if (dog) {
            setSelectedPetForView(dog);
            setShowPetModal(true);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="my-reviews-container">
            {/* Share Your Thoughts Form */}
            <div className="share-thoughts-section">
                <h2 className="section-title">Share Your Thoughts</h2>
                <form onSubmit={handleSubmitReview} className="review-form-card">
                    <div className="form-group">
                        <label>Select Pet</label>
                        <select
                            value={selectedPetId}
                            onChange={(e) => setSelectedPetId(e.target.value)}
                            className="form-select"
                        >
                            <option value="">Choose a pet...</option>
                            {pets.map(pet => (
                                <option key={pet._id} value={pet._id}>{pet.dogName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>How was your experience?</label>
                        <div className="emoji-rating">
                            {EMOJI_RATINGS.map(item => (
                                <button
                                    key={item.value}
                                    type="button"
                                    className={`emoji-btn ${rating === item.value ? 'active' : ''}`}
                                    onClick={() => setRating(item.value)}
                                    title={item.label}
                                >
                                    {item.emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Your Review</label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Write your review here..."
                            rows="4"
                            className="form-textarea"
                        />
                    </div>

                    {formError && <div className="form-error">{formError}</div>}
                    {submitSuccess && <div className="form-success">{submitSuccess}</div>}

                    <button type="submit" className="submit-review-btn">
                        Submit Review
                    </button>
                </form>
            </div>

            {/* My Thoughts Section */}
            <div className="my-thoughts-section">
                <h2 className="section-title">My Thoughts</h2>

                {reviews.length === 0 ? (
                    <div className="no-reviews-card">
                        <span className="empty-icon">📝</span>
                        <p>You haven't written any reviews yet.</p>
                    </div>
                ) : (
                    <div className="reviews-grid">
                        {reviews.map(review => (
                            <div key={review._id} className="review-card">
                                <div className="review-card-header">
                                    <h3 className="review-pet-name">{review.dog?.dogName || 'Unknown Pet'}</h3>
                                    <span className="review-rating">Rating:{renderStars(review.rating)}</span>
                                </div>
                                <span className="review-date">Date: {formatDate(review.date)}</span>
                                <p className="review-text">{review.reviewText}</p>
                                <div className="review-actions">
                                    <button
                                        onClick={() => handleViewPet(review.dog)}
                                        className="view-pet-btn"
                                    >
                                        View Pet
                                    </button>
                                    <button
                                        onClick={() => { setReviewToDelete(review); setShowDeleteConfirm(true); }}
                                        className="delete-review-btn"
                                    >
                                        Delete Review
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* View Pet Modal */}
            {showPetModal && selectedPetForView && (
                <div className="modal-overlay" onClick={() => setShowPetModal(false)}>
                    <div className="modal-content pet-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowPetModal(false)}>×</button>
                        <div className="pet-modal-image">
                            {selectedPetForView.coverImage ? (
                                <img src={selectedPetForView.coverImage} alt={selectedPetForView.dogName} />
                            ) : (
                                <div className="pet-placeholder">🐾</div>
                            )}
                        </div>
                        <div className="pet-modal-info">
                            <h3>{selectedPetForView.dogName}</h3>
                            <p><strong>Breed:</strong> {selectedPetForView.breed}</p>
                            <p><strong>Category:</strong> {selectedPetForView.category}</p>
                            <p><strong>Price:</strong> ₹{selectedPetForView.price?.toLocaleString()}</p>
                            <p><strong>Age:</strong> {selectedPetForView.age}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal">
                        <h3>Delete Review?</h3>
                        <p>Are you sure you want to delete this review?</p>
                        <div className="modal-actions">
                            <button onClick={() => setShowDeleteConfirm(false)} className="cancel-btn">Cancel</button>
                            <button onClick={handleDelete} className="confirm-delete-btn">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMyReview;
