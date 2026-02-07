import React, { useState, useEffect } from 'react';
import api, { endpoints } from '../apiConfig';
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
        setSelectedPet(dog);
        setShowPetModal(true);
    };

    const handleViewProfile = (user) => {
        setSelectedUser(user);
        setShowProfileModal(true);
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    if (loading) return <div className="loading">Loading reviews...</div>;

    return (
        <div className="reviews-container">
            <h1 className="reviews-title">View Reviews</h1>

            <div className="filters-section">
                <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="search-input"
                />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                    <option value="date">Sort by Date: Ascending</option>
                    <option value="rating">Sort by Rating</option>
                </select>
            </div>

            {filteredReviews.length === 0 ? (
                <div className="no-reviews">
                    <span className="empty-icon">⭐</span>
                    <p>No reviews found.</p>
                </div>
            ) : (
                <div className="reviews-list">
                    {paginatedReviews.map(review => (
                        <div key={review._id || review.id} className="review-card">
                            <h3 className="pet-name">{review.dog?.dogName || 'Unknown Pet'}</h3>
                            <div className="review-rating">{renderStars(review.rating)}</div>
                            <p className="review-date"><strong>Date:</strong> {new Date(review.date).toLocaleDateString()}</p>
                            <p className="review-text">{review.reviewText}</p>
                            <div className="review-actions">
                                <button
                                    onClick={() => handleViewPet(review.dog)}
                                    className="view-pet-btn"
                                >
                                    View Pet
                                </button>
                                <button
                                    onClick={() => handleViewProfile(review.user)}
                                    className="view-profile-btn"
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        Previous
                    </button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* View Pet Modal */}
            {showPetModal && selectedPet && (
                <div className="modal-overlay" onClick={() => setShowPetModal(false)}>
                    <div className="modal-content pet-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowPetModal(false)}>×</button>
                        <div className="pet-modal-image">
                            {selectedPet.coverImage ? (
                                <img src={selectedPet.coverImage} alt={selectedPet.dogName} />
                            ) : (
                                <div className="pet-placeholder">🐾</div>
                            )}
                        </div>
                        <div className="pet-modal-info">
                            <h3 className="pet-name-title">{selectedPet.dogName}</h3>
                            <p><strong>Breed:</strong> {selectedPet.breed}</p>
                            <p><strong>Category:</strong> {selectedPet.category}</p>
                            <p><strong>Price:</strong> ₹{selectedPet.price?.toLocaleString()}</p>
                            <p><strong>Age:</strong> {selectedPet.age || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* View Profile Modal */}
            {showProfileModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
                    <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowProfileModal(false)}>×</button>
                        <h3>User Profile</h3>
                        <div className="profile-info">
                            <div className="profile-avatar">
                                {selectedUser.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="profile-details">
                                <p><strong>Username:</strong> {selectedUser.username}</p>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Mobile:</strong> {selectedUser.mobileNumber || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminViewReviews;
