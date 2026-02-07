const Review = require('../models/review');

// Get all reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user', 'username email mobileNumber')
            .populate('dog');

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get review by ID
const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id)
            .populate('user', 'username email mobileNumber')
            .populate('dog');

        if (!review) {
            return res.status(404).json({ message: `Cannot find any review with ID ${id}` });
        }

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reviews by user ID
const getReviewsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await Review.find({ user: userId })
            .populate('user', 'username email mobileNumber')
            .populate('dog');

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: `No reviews found for user ID ${userId}` });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reviews by dog ID
const getReviewsByDogId = async (req, res) => {
    try {
        const { dogId } = req.params;
        const reviews = await Review.find({ dog: dogId })
            .populate('user', 'username email mobileNumber')
            .populate('dog');

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: `No reviews found for dog ID ${dogId}` });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add review
const addReview = async (req, res) => {
    try {
        const newReview = await Review.create(req.body);
        res.status(201).json({ message: 'Review Added Successfully', review: newReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update review
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedReview = await Review.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedReview) {
            return res.status(404).json({ message: `Cannot find any review with ID ${id}` });
        }

        res.status(200).json({ message: 'Review Updated Successfully', review: updatedReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete review
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return res.status(404).json({ message: `Cannot find any review with ID ${id}` });
        }

        res.status(200).json({ message: 'Review Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllReviews,
    getReviewById,
    getReviewsByUserId,
    getReviewsByDogId,
    addReview,
    updateReview,
    deleteReview
};
