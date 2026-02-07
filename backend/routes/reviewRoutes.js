const express = require('express');
const router = express.Router();
const {
    getAllReviews,
    getReviewById,
    getReviewsByUserId,
    getReviewsByDogId,
    addReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');
const { validateToken, isAdmin } = require('../middleware/auth');

// GET all reviews (Admin only - for admin panel)
router.get('/', validateToken, isAdmin, getAllReviews);

// GET review by ID (Public)
router.get('/:id', getReviewById);

// GET reviews by user ID (Authenticated users)
router.get('/user/:userId', validateToken, getReviewsByUserId);

// GET reviews by dog ID (Public - for product page)
router.get('/dog/:dogId', getReviewsByDogId);

// POST add new review (Authenticated users)
router.post('/', validateToken, addReview);

// PUT update review (Authenticated users - should be own review)
router.put('/:id', validateToken, updateReview);

// DELETE review (Authenticated users - can delete own review)
router.delete('/:id', validateToken, deleteReview);

module.exports = router;
