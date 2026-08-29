const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const User = require('../models/User');
const { verifyToken } = require('../middleware/verifyToken');

// Initialize Stripe (using a dummy key if not set, but warn in console)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key';
if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== 'test') {
    console.warn('⚠️ STRIPE_SECRET_KEY is not set in environment. Using dummy key. Stripe calls will fail.');
}
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
});

// ============================================================
// Onboarding for Creators (Stripe Connect)
// POST /api/payments/onboarding
// ============================================================
router.post('/onboarding', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        let accountId = user.stripeConnect?.accountId;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        // If user doesn't have a Stripe account yet, create one
        if (!accountId) {
            const account = await stripe.accounts.create({
                type: 'express',
                email: user.email,
                capabilities: {
                    transfers: { requested: true },
                }
            });

            accountId = account.id;
            
            // Initialize stripeConnect object if null
            if (!user.stripeConnect) {
                user.stripeConnect = {};
            }
            
            user.stripeConnect.accountId = accountId;
            user.stripeConnect.detailsSubmitted = false;
            user.stripeConnect.chargesEnabled = false;
            await user.save();
        }

        // If account is already active, send creator directly to Stripe dashboard.
        if (user.stripeConnect?.chargesEnabled) {
            const loginLink = await stripe.accounts.createLoginLink(accountId);
            return res.json({ url: loginLink.url, mode: 'dashboard' });
        }

        // Create an account link for onboarding
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${frontendUrl}/bio?stripe_refresh=true`,
            return_url: `${frontendUrl}/bio?stripe_return=true`,
            type: 'account_onboarding',
        });

        res.json({ url: accountLink.url, mode: 'onboarding' });
    } catch (error) {
        console.error('❌ Stripe Onboarding Error:', error);
        if (error.message && error.message.includes('signed up for Connect')) {
             return res.status(400).json({ error: 'يرجى تفعيل Stripe Connect في حسابك من خلال: https://dashboard.stripe.com/connect' });
        }
        res.status(500).json({ error: error.message || 'Failed to generate onboarding link' });
    }
});

// ============================================================
// Check Onboarding Status
// GET /api/payments/onboarding/status
// ============================================================
router.get('/onboarding/status', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.stripeConnect?.accountId) {
            return res.json({ status: 'not_started' });
        }

        const account = await stripe.accounts.retrieve(user.stripeConnect.accountId);
        
        user.stripeConnect.detailsSubmitted = account.details_submitted;
        user.stripeConnect.chargesEnabled = account.charges_enabled;
        await user.save();

        if (account.charges_enabled) {
            res.json({ status: 'active', detailsSubmitted: true });
        } else if (account.details_submitted) {
            res.json({ status: 'pending_verification', detailsSubmitted: true });
        } else {
            res.json({ status: 'incomplete', detailsSubmitted: false });
        }

    } catch (error) {
        console.error('❌ Stripe Status Error:', error);
        res.status(500).json({ error: 'Failed to get Stripe status' });
    }
});

// ============================================================
// Create Checkout Session for Visitor buying a Block
// POST /api/payments/checkout/:username/:blockId
// ============================================================
router.post('/checkout/:username/:blockId', async (req, res) => {
    try {
        const { username, blockId } = req.params;
        const { returnUrl } = req.body;

        // Find the creator
        const creator = await User.findOne({ 'bioPage.username': username.toLowerCase() });
        if (!creator) return res.status(404).json({ error: 'Creator not found' });

        // Ensure creator has Stripe enabled
        if (!creator.stripeConnect?.chargesEnabled) {
            return res.status(400).json({ error: 'Creator cannot accept payments yet' });
        }

        // Find the block
        const block = creator.bioPage.blocks.id(blockId);
        if (!block) return res.status(404).json({ error: 'Product not found' });

        // Must be a paywalled block
        if (block.type !== 'paywall' && block.type !== 'file') {
            return res.status(400).json({ error: 'Block is not a paid product' });
        }

        const priceNum = block.settings?.price;
        const currency = block.settings?.currency || 'USD';
        
        if (!priceNum || priceNum <= 0) {
            return res.status(400).json({ error: 'Invalid product price' });
        }

        // Platform fee: 5%
        const platformFeePercent = 0.05;
        const totalAmountCents = Math.round(priceNum * 100);
        const applicationFeeAmount = Math.round(totalAmountCents * platformFeePercent);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: currency.toLowerCase(),
                    product_data: {
                        name: block.title || 'Digital Product',
                        description: block.content || 'Premium Content from ' + (creator.bioPage.displayName || username),
                    },
                    unit_amount: totalAmountCents,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${returnUrl}?success=true&block_id=${blockId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${returnUrl}?canceled=true&block_id=${blockId}`,
            payment_intent_data: {
                application_fee_amount: applicationFeeAmount,
                transfer_data: {
                    destination: creator.stripeConnect.accountId,
                },
            },
            metadata: {
                creatorId: creator._id.toString(),
                blockId: blockId.toString(),
                username: username
            }
        });

        res.json({ url: session.url });

    } catch (error) {
        console.error('❌ Checkout Error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// ============================================================
// Verify Purchase & Unlock Content
// GET /api/payments/verify/:username/:blockId/:sessionId
// ============================================================
router.get('/verify/:username/:blockId/:sessionId', async (req, res) => {
    try {
        const { username, blockId, sessionId } = req.params;

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found' });

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ error: 'Payment not completed' });
        }

        // Double check metadata matches to prevent cross-session attacks
        if (session.metadata.blockId !== blockId || session.metadata.username !== username) {
            return res.status(400).json({ error: 'Invalid session metadata' });
        }

        const creator = await User.findOne({ 'bioPage.username': username.toLowerCase() });
        if (!creator) return res.status(404).json({ error: 'Creator not found' });

        const block = creator.bioPage.blocks.id(blockId);
        if (!block) return res.status(404).json({ error: 'Product not found' });

        // Grant access -> Return the secret URL or File URL
        res.json({ 
            success: true, 
            secretContent: block.settings?.secretContent || block.url,
            message: 'Payment verified successfully. You now have access.'
        });

    } catch (error) {
        console.error('❌ Verification Error:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

module.exports = router;
