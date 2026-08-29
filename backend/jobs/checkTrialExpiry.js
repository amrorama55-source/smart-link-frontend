require('dotenv').config();
const cron = require('node-cron');
const User = require('../models/User');
const {
  sendTrialDay1Email,
  sendTrialDay3Email,
  sendTrialDay5Email,
  sendTrialDay7Email,
  sendTrialExpiredEmail
} = require('../utils/email');

// Schedule daily job to check for trial events and send drip emails
// Runs every hour to check for trial day milestones
cron.schedule('0 * * * *', async () => {
  console.log('🔍 Checking trial events and sending drip campaign emails...');

  try {
    const now = new Date();

    // 1. Find users whose trial expires today (day 7) - send final email
    // FIX: Use two separate Date objects to avoid mutation bug
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const trialEndingToday = await User.find({
      plan: 'trial',
      trialEndsAt: {
        $gte: todayStart,
        $lte: todayEnd
      }
    });

    for (const user of trialEndingToday) {
      console.log(`📧 Sending Day 7 email to ${user.email}`);
      await sendTrialDay7Email(user.email, user.name);
    }

    // 2. Find users on day 12 of trial - send upgrade reminder (2 days left)
    const twelveDaysAgo = new Date();
    twelveDaysAgo.setDate(twelveDaysAgo.getDate() - 12);
    twelveDaysAgo.setHours(0, 0, 0, 0);

    const day12Users = await User.find({
      plan: 'trial',
      trialStartedAt: { $gte: twelveDaysAgo, $lt: new Date(twelveDaysAgo.getTime() + 86400000) },
      'emailPreferences.trialDay5': { $ne: true }
    });

    for (const user of day12Users) {
      console.log(`📧 Sending Day 12 upgrade reminder email to ${user.email}`);
      await sendTrialDay5Email(user.email, user.name);
      user.emailPreferences = user.emailPreferences || {};
      user.emailPreferences.trialDay5 = true;
      await user.save();
    }

    // 3. Find users on day 7 of trial - send feature spotlight (7 days left)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const day7Users = await User.find({
      plan: 'trial',
      trialStartedAt: { $gte: sevenDaysAgo, $lt: new Date(sevenDaysAgo.getTime() + 86400000) },
      'emailPreferences.trialDay3': { $ne: true }
    });

    for (const user of day7Users) {
      console.log(`📧 Sending Day 7 tips email to ${user.email}`);
      await sendTrialDay3Email(user.email, user.name);
      user.emailPreferences = user.emailPreferences || {};
      user.emailPreferences.trialDay3 = true;
      await user.save();
    }

    // 4. Find users on day 1 of trial - send welcome email
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    oneDayAgo.setHours(0, 0, 0, 0);

    const day1Users = await User.find({
      plan: 'trial',
      trialStartedAt: { $gte: oneDayAgo, $lt: new Date(oneDayAgo.getTime() + 86400000) },
      'emailPreferences.trialDay1': { $ne: true }
    });

    for (const user of day1Users) {
      console.log(`📧 Sending Day 1 welcome email to ${user.email}`);
      await sendTrialDay1Email(user.email, user.name);
      user.emailPreferences = user.emailPreferences || {};
      user.emailPreferences.trialDay1 = true;
      await user.save();
    }

  } catch (error) {
    console.error('❌ Error in trial drip campaign:', error);
  }
});

// Schedule daily job to check for expired trials
cron.schedule('0 2 * * *', async () => {
  console.log('🔍 Checking for expired trials...');

  try {
    const now = new Date();

    // Find all users with active trials that have expired AND haven't received the expiry email yet
    const expiredUsers = await User.find({
      plan: 'trial',
      trialEndsAt: { $lt: now },
      'emailPreferences.trialExpired': { $ne: true }
    });

    // Send trial expired email to each expired user (only once)
    for (const user of expiredUsers) {
      console.log(`📧 Sending trial expired email to ${user.email}`);
      await sendTrialExpiredEmail(user.email, user.name);
      user.emailPreferences = user.emailPreferences || {};
      user.emailPreferences.trialExpired = true;
      await user.save();
    }

    // Mark trials as expired and downgrade plan to free
    const result = await User.updateMany(
      {
        plan: 'trial',
        trialEndsAt: { $lt: now },
        trialExpiredAt: { $exists: false }
      },
      {
        $set: {
          trialExpiredAt: now,
          plan: 'free',  // ✅ CRITICAL FIX: Actually downgrade the plan!
          'limits.linksPerMonth': 5,
          'limits.apiRequestsPerDay': 100
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Downgraded ${result.modifiedCount} users from trial to free plan`);

      // Track conversion metrics
      const totalTrialUsers = await User.countDocuments({ plan: 'trial' });
      const convertedUsers = await User.countDocuments({
        trialConvertedAt: { $exists: true, $ne: null }
      });
      const expiredTrialUsers = await User.countDocuments({
        trialExpiredAt: { $exists: true, $ne: null }
      });

      const conversionRate = totalTrialUsers > 0 ? ((convertedUsers / totalTrialUsers) * 100).toFixed(2) : 0;
      const expiryRate = totalTrialUsers > 0 ? ((expiredTrialUsers / totalTrialUsers) * 100).toFixed(2) : 0;

      console.log(`📊 Trial Analytics:`);
      console.log(`   - Total trial users: ${totalTrialUsers}`);
      console.log(`   - Converted users: ${convertedUsers} (${conversionRate}%)`);
      console.log(`   - Expired trials: ${expiredTrialUsers} (${expiryRate}%)`);
    }

  } catch (error) {
    console.error('❌ Error checking expired trials:', error);
  }
});

console.log('📅 Trial management jobs scheduled:');
console.log('   - Hourly: Drip campaign emails (Day 1, 3, 5, 7)');
console.log('   - Daily 2 AM: Trial expiration check');
