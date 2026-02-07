const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
    dogName: {
        type: String,
        required: true,
        trim: true
    },
    breed: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Puppy', 'Adult', 'Senior', 'Small', 'Medium', 'Large']
    },
    coverImage: {
        type: String,
        required: true
    }
});

const Dog = mongoose.model('Dog', dogSchema);

module.exports = Dog;
