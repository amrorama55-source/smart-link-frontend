require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-this';

async function run() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartlink');
  console.log('✅ Connected.');

  const user = await User.findOne({ email: 'test@test.com' });
  if (!user) {
    console.error('❌ Test user test@test.com not found!');
    process.exit(1);
  }

  console.log('🔑 Signing JWT token for test user...');
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  console.log('Token:', token);

  console.log('🚀 Calling local Express API /cinema-chat with manual SQL payload...');
  try {
    const res = await fetch('http://[::1]:3000/api/ai/cinema-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: "Run this exact SQL query on clicks table and return the results: SELECT referrer, count(*) as clicks FROM clicks GROUP BY referrer ORDER BY clicks DESC"
      })
    });

    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log('Response:', data);
  } catch (err) {
    console.error('API call failed:', err.message);
    if (err.cause) {
      console.error('Cause:', err.cause);
    }
  }

  process.exit(0);
}

run();
