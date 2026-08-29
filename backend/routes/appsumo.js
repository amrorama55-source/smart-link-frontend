const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken');
const User = require('../models/User');
const AppSumoCode = require('../models/AppSumoCode');

// @route   POST /api/appsumo/redeem
// @desc    Redeem an AppSumo code and apply stacking logic
// @access  Private
router.post('/redeem', verifyToken, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Please provide an AppSumo code' });
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Check if the code is valid and available
    const appSumoCode = await AppSumoCode.findOne({ code: cleanCode, isRedeemed: false });
    if (!appSumoCode) {
      return res.status(400).json({ message: 'Invalid code or already redeemed' });
    }

    // 2. Find the current user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3. Mark code as redeemed
    appSumoCode.isRedeemed = true;
    appSumoCode.redeemedBy = user._id;
    appSumoCode.redeemedAt = new Date();
    await appSumoCode.save();

    // 4. Update user's stacked codes
    if (!user.appSumoCodes) {
      user.appSumoCodes = [];
    }
    // Prevent applying the exact same code twice just in case (though it's blocked by isRedeemed above)
    if (!user.appSumoCodes.includes(cleanCode)) {
      user.appSumoCodes.push(cleanCode);
    }

    const codeCount = user.appSumoCodes.length;

    // 5. Stacking Logic
    let newPlan = user.plan;
    let limits = { ...user.limits };

    if (codeCount === 1) {
      newPlan = 'starter';
      limits.linksPerMonth = 10000;
      limits.apiRequestsPerDay = 1000;
    } else if (codeCount === 2) {
      newPlan = 'pro';
      limits.linksPerMonth = 50000;
      limits.apiRequestsPerDay = 5000;
    } else if (codeCount >= 3) {
      newPlan = 'business'; // Unlimited/Agency
      limits.linksPerMonth = 9999999;
      limits.apiRequestsPerDay = 9999999;
    }

    // We can use the __allowTrial flag to bypass strict plan protection if needed, 
    // but the pre-save hook only blocks setting plan to 'trial', not other plans.
    user.plan = newPlan;
    user.limits = limits;
    
    // Clear subscription status so they don't get billed, it's a Lifetime Deal
    user.subscription.status = 'active';
    user.subscription.interval = 'lifetime';

    await user.save();

    res.json({
      message: 'Code successfully redeemed!',
      plan: user.plan,
      stackedCodesCount: codeCount,
      limits: user.limits
    });

  } catch (error) {
    console.error('AppSumo Redeem Error:', error);
    res.status(500).json({ message: 'Server error while redeeming code' });
  }
});

module.exports = router;
