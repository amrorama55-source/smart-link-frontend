require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  console.log('⚡ Creating a local test account...');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔌 Connected to MongoDBAtlas.');

    // Delete existing test user to allow re-running
    await User.deleteOne({ email: 'test@test.com' });
    
    // Create new test user (Mongoose will auto-hash 'password123' in the pre-save hook)
    const testUser = new User({
      name: 'Test Admin',
      email: 'test@test.com',
      password: 'password123',
      plan: 'trial',
      isEmailVerified: true
    });

    await testUser.save();
    console.log('✅ Local test account created successfully!');
    console.log('👉 Email: test@test.com');
    console.log('👉 Password: password123');

  } catch (err) {
    console.error('❌ Failed to create test account:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
