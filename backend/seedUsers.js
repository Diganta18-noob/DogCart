const mongoose = require('mongoose');
const User = require('./models/user');

// Demo users data
const demoUsers = [
    {
        username: 'demouser',
        email: 'demouser@gmail.com',
        mobileNumber: '1234567890',
        password: 'demouser123',
        userRole: 'User'
    },
    {
        username: 'demoadmin',
        email: 'demoadmin@gmail.com',
        mobileNumber: '0987654321',
        password: 'demoadmin123',
        userRole: 'Admin'
    },
    {
        username: 'john_doe',
        email: 'john@gmail.com',
        mobileNumber: '9876543210',
        password: 'john123',
        userRole: 'User'
    },
    {
        username: 'jane_smith',
        email: 'jane@gmail.com',
        mobileNumber: '8765432109',
        password: 'jane123',
        userRole: 'User'
    },
    {
        username: 'mike_wilson',
        email: 'mike@gmail.com',
        mobileNumber: '7654321098',
        password: 'mike123',
        userRole: 'User'
    },
    {
        username: 'sarah_jones',
        email: 'sarah@gmail.com',
        mobileNumber: '6543210987',
        password: 'sarah123',
        userRole: 'User'
    }
];

// Connect to MongoDB and seed users
mongoose.connect('mongodb://localhost:27017/pawmart')
    .then(async () => {
        console.log('Connected to MongoDB');

        for (const userData of demoUsers) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });

            if (existingUser) {
                console.log(`User ${userData.username} already exists, skipping...`);
            } else {
                await User.create(userData);
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
