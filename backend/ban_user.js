/**
 * 🚫 Ban User Script
 * 
 * Usage:
 *   node ban_user.js boligbyggelagetusbl
 * 
 * This script will:
 * 1. Find the user who owns the shortCode (or bio page username)
 * 2. Set isBanned = true, bannedAt = now, banReason = "Phishing"
 * 3. Deactivate ALL links owned by that user
 * 4. Clear their sessions so they're logged out immediately
 */

const mongoose = require('mongoose');
const Link = require('./models/Link');
const User = require('./models/User');
require('dotenv').config();

async function banUser() {
  const shortCode = process.argv[2] || 'boligbyggelagetusbl';
  const banReason = process.argv[3] || 'Phishing - Cloudflare abuse report';

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // --- Step 1: Find the user ---
    let userId = null;
    let userEmail = null;

    // Check if it's a link shortCode
    const link = await Link.findOne({ shortCode }).populate('userId');
    if (link) {
      userId = link.userId._id;
      userEmail = link.userId.email;
      console.log('🔍 Found link:', shortCode);
      console.log('   Original URL:', link.originalUrl);
      console.log('   User ID:', userId);
      console.log('   User Email:', userEmail);
      console.log('   User Name:', link.userId.name);
    } else {
      // Check if it's a bioPage username
      const user = await User.findOne({ 'bioPage.username': shortCode.toLowerCase() });
      if (user) {
        userId = user._id;
        userEmail = user.email;
        console.log('🔍 Found user by bioPage username:', shortCode);
        console.log('   User ID:', userId);
        console.log('   User Email:', userEmail);
      } else {
        console.log('❌ No link or user found with:', shortCode);
        await mongoose.disconnect();
        return;
      }
    }

    // --- Step 2: Ban the user ---
    console.log('\n🚫 Banning user...');
    const user = await User.findById(userId);
    
    if (user.isBanned) {
      console.log('⚠️  User is ALREADY banned (bannedAt:', user.bannedAt, ')');
      console.log('   Reason:', user.banReason);
    } else {
      user.isBanned = true;
      user.bannedAt = new Date();
      user.banReason = banReason;
      user.sessions = []; // Clear all sessions = force logout
      await user.save();
      console.log('✅ User BANNED successfully!');
      console.log('   bannedAt:', user.bannedAt);
      console.log('   banReason:', user.banReason);
    }

    // --- Step 3: Deactivate ALL their links ---
    console.log('\n🔗 Deactivating all user links...');
    const result = await Link.updateMany(
      { userId: userId },
      { $set: { isActive: false } }
    );
    console.log(`✅ Deactivated ${result.modifiedCount} links (${result.matchedCount} total)`);

    // --- Step 4: Summary ---
    const totalLinks = await Link.countDocuments({ userId: userId });
    console.log('\n========================================');
    console.log('📋 BAN SUMMARY');
    console.log('========================================');
    console.log(`User:    ${userEmail}`);
    console.log(`User ID: ${userId}`);
    console.log(`Status:  🚫 BANNED`);
    console.log(`Reason:  ${banReason}`);
    console.log(`Links:   ${totalLinks} total (all deactivated)`);
    console.log('========================================');
    console.log('\n✅ Done! The user is now:');
    console.log('   - Cannot login (JWT blocked)');
    console.log('   - Cannot use API (API key blocked)');
    console.log('   - All links show "Content Removed" page');
    console.log('   - All sessions cleared (forced logout)');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
  }
}

banUser();
