import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../cartSlice';
import api, { endpoints } from '../apiConfig';
import { toast } from 'react-toastify';
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
                const initialQuantities = {};
                response.data.forEach(pet => {
                    initialQuantities[pet._id] = 1;
                });
                setQuantities(initialQuantities);
            } catch (error) {
                console.error('Error fetching pets:', error);
                toast.error('Failed to fetch pets. Please try again.');
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

        if (qty > pet.stockQuantity) {
            toast.error(`Insufficient stock. Available: ${pet.stockQuantity}`);
            return;
        }

        dispatch(addToCart({
            id: pet._id,
            name: pet.dogName,
            price: pet.price,
            image: pet.coverImage,
            quantity: qty,
            stockQuantity: pet.stockQuantity
        }));
        setAddedPetName(pet.dogName);
        setShowAddedModal(true);
        setTimeout(() => setShowAddedModal(false), 2000);
    };

    const fetchPetReviews = async (petId) => {
        try {
            const response = await api.get(endpoints.reviewsByPet(petId));
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

    const getStockBadge = (stock) => {
        if (stock <= 0) return <span className="badge badge-error gap-1 text-white font-semibold">Out of Stock</span>;
        if (stock <= 10) return <span className="badge badge-warning gap-1 text-neutral font-semibold">Only {stock} Left</span>;
        return <span className="badge badge-success gap-1 text-white font-semibold">In Stock</span>;
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
                <span className="loading loading-ring loading-lg text-primary"></span>
                <p className="text-slate-400 font-medium">Loading pets...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 relative overflow-hidden bg-grid-pattern pt-24 pb-16 px-4 md:px-8">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 right-1/10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
            <div className="absolute bottom-1/4 left-1/10 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-float"></div>

            <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10">
                {/* Header & Search block */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-200/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-lg">
                    <div>
                        <h1 className="text-3xl font-bold font-outfit text-gradient-primary">
                            🐕 Available Pets
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Browse, read user reviews, and adopt your new friend.</p>
                    </div>

                    <div className="w-full md:w-72 relative">
                        <input
                            type="text"
                            placeholder="Search by name or breed..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="input-premium pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Pets Grid */}
                {paginatedPets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {paginatedPets.map(pet => (
                            <div key={pet._id} className="glass-card-hover flex flex-col h-full bg-base-200/40">
                                {/* Pet Image */}
                                <div className="h-48 relative overflow-hidden rounded-t-2xl bg-base-300">
                                    {pet.coverImage ? (
                                        <img src={pet.coverImage} alt={pet.dogName} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl text-slate-500 bg-slate-800">
                                            🐾
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        {getStockBadge(pet.stockQuantity)}
                                    </div>
                                </div>

                                {/* Pet Info */}
                                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold font-outfit text-white leading-tight">{pet.dogName}</h3>
                                            <span className="text-primary font-bold text-lg">₹{pet.price?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <span className="badge badge-sm badge-neutral bg-white/5 border-white/10 text-slate-300">{pet.breed}</span>
                                            <span className="badge badge-sm badge-neutral bg-white/5 border-white/10 text-slate-300">{pet.category}</span>
                                        </div>
                                    </div>

                                    {/* Action Row */}
                                    <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-semibold text-slate-400">Quantity:</span>
                                            <select
                                                value={quantities[pet._id] || 1}
                                                onChange={(e) => handleQuantityChange(pet._id, e.target.value)}
                                                className="select select-bordered select-xs w-20 bg-base-300 border-white/10 text-xs rounded-lg"
                                            >
                                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(pet)}
                                            className="btn btn-gradient-primary btn-sm w-full mt-1 text-white font-semibold rounded-xl"
                                            disabled={pet.stockQuantity <= 0}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>

                                    {/* Reviews Row */}
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <button onClick={() => handleViewReviews(pet)} className="btn btn-xs btn-outline border-white/5 hover:bg-white/5 text-slate-300 rounded-lg">
                                            View Reviews
                                        </button>
                                        <button onClick={() => handleWriteReview(pet)} className="btn btn-xs btn-ghost text-slate-400 hover:text-white rounded-lg">
                                            Write Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center flex flex-col items-center gap-3">
                        <span className="text-4xl">🐕</span>
                        <p className="text-slate-300 font-semibold text-lg">No pets match your criteria.</p>
                        <p className="text-slate-500 text-sm">Try typing a different name or breed.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="btn btn-sm btn-outline border-white/10 text-slate-300 disabled:opacity-30 rounded-xl"
                        >
                            ⬅ Prev
                        </button>
                        <span className="text-sm font-semibold text-slate-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="btn btn-sm btn-outline border-white/10 text-slate-300 disabled:opacity-30 rounded-xl"
                        >
                            Next ➡
                        </button>
                    </div>
                )}
            </div>

            {/* Reviews Modal */}
            {showReviews && selectedPet && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowReviews(false)}>
                    <div className="glass-card max-w-2xl w-full p-6 mx-4 animate-scale-in border border-white/10 flex flex-col gap-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center pb-3 border-b border-white/5">
                            <h3 className="text-xl font-bold font-outfit text-gradient-primary">
                                Reviews for {selectedPet.dogName}
                            </h3>
                            <button className="btn btn-ghost btn-circle btn-sm text-slate-400 hover:text-white" onClick={() => setShowReviews(false)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Rating Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 border border-white/5 p-5 rounded-2xl">
                            <div className="flex flex-col items-center justify-center gap-1">
                                <span className="text-5xl font-extrabold font-outfit text-white">
                                    {reviews.length > 0
                                        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                                        : '0.0'}
                                </span>
                                <div className="flex gap-1 my-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span key={star} className={`text-xl ${star <= (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0) ? 'text-amber-400' : 'text-slate-600'}`}>★</span>
                                    ))}
                                </div>
                                <span className="text-xs text-slate-400">Based on {reviews.length} reviews</span>
                            </div>

                            <div className="flex flex-col gap-2 justify-center">
                                {[5, 4, 3, 2, 1].map(star => {
                                    const count = reviews.filter(r => r.rating === star).length;
                                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-3 text-xs">
                                            <span className="w-3 text-slate-400 font-semibold">{star}</span>
                                            <span className="text-amber-400">★</span>
                                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-400" style={{ width: `${percentage}%` }}></div>
                                            </div>
                                            <span className="w-8 text-right text-slate-400 font-semibold">{Math.round(percentage)}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="flex flex-col gap-4 overflow-y-auto max-h-[35vh] pr-2">
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div key={review._id} className="p-4 bg-base-300/40 rounded-xl border border-white/5 flex flex-col gap-2">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-primary/20 text-primary rounded-full w-8 h-8 font-bold text-sm uppercase">
                                                        {review.username ? review.username.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-200">{review.username || 'User'}</span>
                                                    <span className="text-[10px] text-slate-500">{review.date || 'Verified Purchase'}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <span key={s} className={`text-sm ${s <= review.rating ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed pl-11">{review.text}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-center py-6 text-sm">No reviews yet. Be the first to share your thoughts!</p>
                            )}
                        </div>

                        <div className="pt-3 border-t border-white/5 flex justify-end gap-3">
                            <button onClick={() => { setShowReviews(false); handleWriteReview(selectedPet); }} className="btn btn-gradient-primary btn-sm rounded-xl text-white">
                                ✎ Write a Review
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Added Toast Alert */}
            {showAddedModal && (
                <div className="toast-float shadow-emerald/10 border border-emerald-400/20">
                    ✓ {addedPetName} added to cart!
                </div>
            )}
        </div>
    );
};

export default UserViewPets;
