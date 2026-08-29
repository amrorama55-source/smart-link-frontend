// scripts/create_extension_user.js
// Run this script ONCE to create a system user for the extension shortener:
//   node scripts/create_extension_user.js
//
// Then copy the output ID into your .env as EXTENSION_USER_ID=<id>
// Also add it to your Railway environment variables.

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email: 'extension-system@by-smartlink.com' });
  if (existing) {
    console.log('✅ Extension system user already exists!');
    console.log('EXTENSION_USER_ID=' + existing._id.toString());
    await mongoose.disconnect();
    return;
  }

  const user = new User({
    name: 'Extension System User',
    email: 'extension-system@by-smartlink.com',
    password: require('crypto').randomBytes(32).toString('hex'),
    plan: 'business',
    isVerified: true,
    isActive: true,
    limits: { linksPerMonth: -1 }
  });

  await user.save();

  console.log('✅ Extension system user created successfully!');
  console.log('');
  console.log('Add this to your .env and Railway environment variables:');
  console.log('EXTENSION_USER_ID=' + user._id.toString());
  console.log('');
  console.log('Then restart your server.');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
