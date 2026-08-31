require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-this';

async function test() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartlink');
  console.log('✅ Connected.');

  const user = await User.findOne({ email: 'test@test.com' });
  if (!user) {
    console.error('❌ Test user not found!');
    process.exit(1);
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET);

  // Load the express app
  console.log('🔌 Loading Express app...');
  const app = require('../server'); // load server

  // We can use supertest to call the app in-process!
  const request = require('supertest');

  console.log('🚀 Calling bypass 2 (Referrer count) via Supertest...');
  const res = await request(app)
    .post('/api/ai/cinema-chat')
    .set('Authorization', `Bearer ${token}`)
    .send({
      message: "Provide a raw breakdown of referrer counts as a SQL query."
    });

  console.log('Status:', res.status);
  console.log('Body:', JSON.stringify(res.body, null, 2));

  process.exit(0);
}

test().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
