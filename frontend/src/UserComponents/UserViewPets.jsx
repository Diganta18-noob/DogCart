import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../cartSlice';
import api, { endpoints } from '../apiConfig';
import './UserViewPets.css';

const ITEMS_PER_PAGE = 4;

const UserViewPets = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPet, setSelectedPet] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [showReviews, setShowReviews] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [showAddedModal, setShowAddedModal] = useState(false);
    const [addedPetName, setAddedPetName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await api.get(endpoints.pets);
                setPets(response.data);
                // Initialize quantities for each pet
                const initialQuantities = {};
                response.data.forEach(pet => {
                    initialQuantities[pet._id] = 1;
                });
                setQuantities(initialQuantities);
            } catch (error) {
                console.error('Error fetching pets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPets();
    }, []);

    const filteredPets = pets.filter(pet =>
        pet.dogName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredPets.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedPets = filteredPets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleQuantityChange = (petId, value) => {
        setQuantities(prev => ({
            ...prev,
            [petId]: parseInt(value)
        }));
    };

    const handleAddToCart = (pet) => {
        const qty = quantities[pet._id] || 1;
        dispatch(addToCart({
            id: pet._id,
            name: pet.dogName,
            price: pet.price,
            image: pet.coverImage,
            quantity: qty
        }));
        setAddedPetName(pet.dogName);
        setShowAddedModal(true);
        setTimeout(() => setShowAddedModal(false), 2000);
    };

    const fetchPetReviews = async (petId) => {
        try {
            const response = await api.get(`${endpoints.reviews}?petId=${petId}`);
            setReviews(response.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        }
    };

    const handleViewReviews = async (pet) => {
        setSelectedPet(pet);
        await fetchPetReviews(pet._id);
        setShowReviews(true);
    };

    const handleWriteReview = (pet) => {
        navigate('/my-reviews', { state: { petId: pet._id, petName: pet.dogName } });
    };

    const getStockStatus = (stock) => {
        if (stock <= 0) return { text: 'Out of Stock', className: 'stock-out' };
        if (stock <= 10) return { text: `Limited Stock: ${stock}`, className: 'stock-limited' };
        return { text: `In Stock: ${stock}`, className: 'stock-available' };
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    if (loading) return <div className="loading">Loading pets...</div>;

    return (
        <div className="user-pets-container">
            <h1 className="pets-title">🐕 Pets</h1>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search pets..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="search-input"
                />
            </div>

            <div className="pets-grid">
                {paginatedPets.map(pet => {
                    const stockStatus = getStockStatus(pet.stockQuantity);
                    return (
                        <div key={pet._id} className="pet-card">
                            <div className="pet-image">
                                {pet.coverImage ? <img src={pet.coverImage} alt={pet.dogName} /> : <div className="pet-placeholder">🐾</div>}
                            </div>
                            <div className="pet-info">
                                <h3 className="pet-name">{pet.dogName}</h3>
                                <p className="pet-price">₹{pet.price?.toLocaleString()}</p>
                                <p className="pet-breed">Breed: {pet.breed}</p>
                                <p className="pet-category">Category: {pet.category}</p>
                                <p className={`pet-stock ${stockStatus.className}`}>{stockStatus.text}</p>
                            </div>
                            <div className="pet-actions">
                                <div className="quantity-row">
                                    <label>Qty:</label>
                                    <select
                                        value={quantities[pet._id] || 1}
                                        onChange={(e) => handleQuantityChange(pet._id, e.target.value)}
                                    >
                                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(pet)}
                                    className="add-cart-btn"
                                    disabled={pet.stockQuantity <= 0}
                                >
                                    Add to Cart
                                </button>
                            </div>
                            <div className="review-actions">
                                <button onClick={() => handleViewReviews(pet)} className="view-reviews-btn">
                                    View Reviews
                                </button>
                                <button onClick={() => handleWriteReview(pet)} className="write-review-btn">
                                    Write Review
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        ⬅ Previous
                    </button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                    >
                        Next ➡
                    </button>
                </div>
            )}

            {showReviews && selectedPet && (
                <div className="modal-overlay" onClick={() => setShowReviews(false)}>
                    <div className="modal-content reviews-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-x" onClick={() => setShowReviews(false)}>×</button>
                        <h3>Reviews for {selectedPet.dogName}</h3>
                        <div className="reviews-list">
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div key={review._id} className="review-item">
                                        <div className="review-header">
                                            <span className="reviewer-badge">{review.username || 'User'}</span>
                                            <span className="rating">⭐ {review.rating}/5</span>
                                        </div>
                                        <p className="review-text">{review.text}</p>
                                        <span className="review-date">{review.date}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="no-reviews">No reviews yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showAddedModal && (
                <div className="toast-notification">
                    ✓ {addedPetName} added to cart!
                </div>
            )}
        </div>
    );
};

export default UserViewPets;
