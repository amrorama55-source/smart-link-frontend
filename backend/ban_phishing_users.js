const mongoose = require('mongoose');
const Link = require('./models/Link');
const User = require('./models/User');
require('dotenv').config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');

  // Phishing users to ban
  const targets = [
    // The reported phishing user (boligbyggelagetusbl link - already deleted)
    { id: '69f042725df7b90a80d05c93', email: 'josephdunbar0@gmail.com' },
    // Same phishing pattern - Microsoft OneDrive/SharePoint phishing via museetmidtnorge.smmall.cloud
    { email: 'bill527445@gmail.com' },
  ];

  for (const target of targets) {
    let user;
    if (target.id) {
      user = await User.findById(target.id);
    } else {
      user = await User.findOne({ email: target.email });
    }

    if (!user) {
      console.log('❌ User not found:', target.email || target.id);
      continue;
    }

    console.log('========================================');
    console.log('👤 User:', user.email);
    console.log('   Name:', user.name);
    console.log('   ID:', user._id);
    console.log('   Plan:', user.plan);
    console.log('   Already banned:', user.isBanned ? 'YES ⚠️' : 'NO');

    // Show their links
    const links = await Link.find({ userId: user._id });
    console.log('   Links (' + links.length + '):');
    links.forEach(l => console.log('     📎', l.shortCode, '->', l.originalUrl));

    // BAN
    user.isBanned = true;
    user.bannedAt = new Date();
    user.banReason = 'Phishing - Microsoft impersonation - Cloudflare abuse report #5f3055aa4b16ae72';
    user.sessions = []; // Force logout
    await user.save();
    console.log('\n   ✅ USER BANNED!');

    // Deactivate ALL their links
    if (links.length > 0) {
      const result = await Link.updateMany({ userId: user._id }, { $set: { isActive: false } });
      console.log('   ✅ Deactivated', result.modifiedCount, 'links');
    }
    console.log('========================================\n');
  }

  console.log('🏁 Done! All phishing users are now banned.');
  await mongoose.disconnect();
})();
