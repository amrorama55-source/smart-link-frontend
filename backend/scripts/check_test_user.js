require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  console.log('⚡ Checking test account...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: 'test@test.com' });
    if (!user) {
      console.log('❌ User not found!');
    } else {
      console.log('✅ User found:', {
        id: user._id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        hasPassword: !!user.password,
        passwordHash: user.password
      });

      const isMatch = await user.comparePassword('password123');
      console.log('🔑 Password match test ("password123"):', isMatch);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
