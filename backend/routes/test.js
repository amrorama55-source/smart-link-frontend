cd const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { 
  sendTrialDay1Email, 
  sendTrialDay3Email, 
  sendTrialDay5Email, 
  sendTrialDay7Email,
  sendTrialExpiredEmail 
} = require('../utils/email');

/**
 * POST /api/test/send-drip-email
 * Test endpoint to manually send a drip campaign email
 * Body: { email: "test@example.com", day: 1|3|5|7|"expired", name: "Test User" }
 */
router.post('/send-drip-email', async (req, res) => {
  try {
    const { email, day, name = 'Test User' } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let result;
    let subject;

    switch (day) {
      case 1:
        result = await sendTrialDay1Email(email, name);
        subject = 'Day 1 - Welcome';
        break;
      case 3:
        result = await sendTrialDay3Email(email, name);
        subject = 'Day 3 - Feature Spotlight';
        break;
      case 5:
        result = await sendTrialDay5Email(email, name);
        subject = 'Day 5 - Upgrade Reminder';
        break;
      case 7:
        result = await sendTrialDay7Email(email, name);
        subject = 'Day 7 - Last Chance';
        break;
      case 'expired':
        result = await sendTrialExpiredEmail(email, name);
        subjectired';
        break = 'Trial Exp;
      default:
        return res.status(400).json({ 
          error: 'Invalid day. Use 1, 3, 5, 7, or "expired"' 
        });
    }

    console.log(`✅ Test email sent: ${subject} to ${email}`);
    res.json({ 
      success: true, 
      message: `Test email sent: ${subject}`,
      result 
    });
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/test/drip-status
 * Check which drip emails have been sent to a user
 */
router.get('/drip-status/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      email: user.email,
      plan: user.plan,
      trialStartedAt: user.trialStartedAt,
      trialEndsAt: user.trialEndsAt,
      emailPreferences: user.emailPreferences || {}
    });
  } catch (error) {
    console.error('Error checking drip status:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/test/reset-drip-prefs
 * Reset drip email preferences for a user (to receive emails again)
 */
router.post('/reset-drip-prefs', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { 
        $set: { 
          'emailPreferences.trialDay1': false,
          'emailPreferences.trialDay3': false,
          'emailPreferences.trialDay5': false
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      success: true, 
      message: 'Drip preferences reset',
      emailPreferences: user.emailPreferences 
    });
  } catch (error) {
    console.error('Error resetting drip prefs:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
