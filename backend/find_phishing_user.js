const mongoose = require('mongoose');
const Link = require('./models/Link');
const User = require('./models/User');
require('dotenv').config();

async function findPhishingUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const shortCode = 'boligbyggelagetusbl';
    const link = await Link.findOne({ shortCode }).populate('userId');

    if (!link) {
      console.log(`No link found with shortCode: ${shortCode}`);
      // Check if it's a bioPage username
      const user = await User.findOne({ 'bioPage.username': shortCode.toLowerCase() });
      if (user) {
        console.log('Found user by bioPage username:');
        console.log(`User ID: ${user._id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Name: ${user.name}`);
      } else {
        console.log('No user found with that bioPage username either.');
      }
    } else {
      console.log('Found link:');
      console.log(`Link ID: ${link._id}`);
      console.log(`Original URL: ${link.originalUrl}`);
      console.log(`User ID: ${link.userId._id}`);
      console.log(`User Email: ${link.userId.email}`);
      console.log(`User Name: ${link.userId.name}`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

findPhishingUser();
