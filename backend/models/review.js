const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewText: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dog',
        required: true
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
