require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔌 Connecting to MongoDB at:', process.env.MONGODB_URI.split('@')[1] || 'URL');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✅ Connected successfully to MongoDB!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

test();
