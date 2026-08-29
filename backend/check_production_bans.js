require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkBans() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected.');

    const emails = ['josephdunbar0@gmail.com', 'bill527445@gmail.com'];
    
    console.log('\n--- BAN STATUS REPORT ---');
    for (const email of emails) {
      const user = await User.findOne({ email });
      if (user) {
        console.log(`👤 User: ${email}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Is Banned: ${user.isBanned ? '✅ YES (Banned)' : '❌ NO (Not Banned)'}`);
        console.log(`   Ban Reason: ${user.banReason || 'None'}`);
        console.log('-------------------------');
      } else {
        console.log(`👤 User: ${email} -> ❌ NOT FOUND in database.`);
        console.log('-------------------------');
      }
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error checking bans:', error);
    process.exit(1);
  }
}

checkBans();
