const mongoose = require('mongoose');
const Link = require('./models/Link');
const User = require('./models/User');
require('dotenv').config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');

  // Search for the phishing link
  console.log('--- Searching for bolig* links ---');
  const links = await Link.find({ shortCode: new RegExp('bolig', 'i') }).populate('userId', 'email name');
  console.log('Links found:', links.length);
  links.forEach(l => console.log('  ', l.shortCode, '->', l.originalUrl, '| Owner:', l.userId?.email));

  // Search bio pages
  console.log('\n--- Searching bio pages ---');
  const users = await User.find({ 'bioPage.username': new RegExp('bolig', 'i') });
  console.log('Users found:', users.length);
  users.forEach(u => console.log('  ', u.email, '| bio:', u.bioPage?.username));

  // Show recent links
  console.log('\n--- Last 15 links in DB ---');
  const recent = await Link.find({}).sort({ createdAt: -1 }).limit(15).populate('userId', 'email name');
  recent.forEach(l => console.log('  ', l.shortCode, '->', (l.originalUrl || '').substring(0, 80), '| Owner:', l.userId?.email));

  // Check if link was possibly deleted
  console.log('\n--- Total links in DB:', await Link.countDocuments(), '---');
  console.log('--- Total users in DB:', await User.countDocuments(), '---');

  await mongoose.disconnect();
})();
