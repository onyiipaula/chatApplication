const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

mongoose.connect(process.env.DB_URL)
  .then(async () => {
    console.log('Database connected for testing...');

    // Create a new user
    const newUser = new User({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
    });

    await newUser.save();
    console.log('User created:', newUser);
    mongoose.connection.close();
  })
  .catch((err) => console.error('Error:', err.message));
