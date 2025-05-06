const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const mongoose = require('mongoose');
require('dotenv').config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      process.exit(0);
    }
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword
    });

    await testUser.save();
    console.log('Test user created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating test user:', err);
    process.exit(1);
  }
}

createTestUser();