require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');

const SALT_ROUNDS = 10;

const demoUsers = [
    {
        username: 'demouser',
        email: 'demouser@gmail.com',
        mobileNumber: '9876543210',
        password: 'demouser123',
        userRole: 'user',
    },
    {
        username: 'demoadmin',
        email: 'demoadmin@gmail.com',
        mobileNumber: '9876543211',
        password: 'demoadmin123',
        userRole: 'admin',
    },
];

// Connect to MongoDB and seed users
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pawmart';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        for (const userData of demoUsers) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });

            if (existingUser) {
                console.log(`User ${userData.username} already exists, skipping...`);
            } else {
                // Hash password before seeding
                const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
                await User.create({ ...userData, password: hashedPassword });
                console.log(`Created user: ${userData.username} (${userData.userRole})`);
            }
        }

        console.log('\n=== Demo Users ===');
        console.log('User Account:');
        console.log('  Email: demouser@gmail.com');
        console.log('  Password: demouser123');
        console.log('\nAdmin Account:');
        console.log('  Email: demoadmin@gmail.com');
        console.log('  Password: demoadmin123');
        console.log('==================\n');

        mongoose.connection.close();
        console.log('Done! MongoDB connection closed.');
    })
    .catch((error) => {
        console.log('Error:', error.message);
        process.exit(1);
    });
