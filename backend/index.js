const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const dogRoutes = require('./routes/dogRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/pawmart')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    });

// Use routes
app.use('/dogs', dogRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);
app.use('/dashboard', dashboardRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to PawMart API' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
