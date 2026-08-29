const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const WebhookEvent = require('../models/WebhookEvent');
const Stripe = require('stripe');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key';
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
const VARIANT_PLAN_MAP = {
    // ── Starter Plan ──────────────────────────────────────────
    [process.env.LS_STARTER_MONTHLY_VARIANT_ID || '1860087']: { plan: 'starter', interval: 'monthly' },
    [process.env.LS_STARTER_YEARLY_VARIANT_ID  || '1860089']: { plan: 'starter', interval: 'yearly'  },
    // ── Pro Affiliate Plan ────────────────────────────────────
    [process.env.LS_PRO_MONTHLY_VARIANT_ID     || '1860091']: { plan: 'pro',      interval: 'monthly' },
    [process.env.LS_PRO_YEARLY_VARIANT_ID      || '1860092']: { plan: 'pro',      interval: 'yearly'  },
    // ── Agency Elite (Business) Plan ─────────────────────────
    [process.env.LS_BUSINESS_MONTHLY_VARIANT_ID || '1860094']: { plan: 'business', interval: 'monthly' },
    [process.env.LS_BUSINESS_YEARLY_VARIANT_ID  || '1860095']: { plan: 'business', interval: 'yearly'  },
};
const getPlanLimits = (plan) => {
    switch (plan) {
        case 'starter':
            return { linksPerMonth: 15, apiRequestsPerDay: 500 };
        case 'pro':
            return { linksPerMonth: -1, apiRequestsPerDay: 1000 }; // Unlimited links
        case 'business':
            return { linksPerMonth: -1, apiRequestsPerDay: -1 }; // Fully unlimited
        default: // free
            return { linksPerMonth: 5, apiRequestsPerDay: 100 };
    }
};

// Resolve user by user_id from custom_data, or by customer email from payload
async function resolveUserFromEvent(event, data, userId) {
    if (userId) {
        const byId = await User.findById(userId);
        if (byId) return byId;
    }
    const emailFromPayload =
        data?.attributes?.user_email ||
        data?.attributes?.email ||
        data?.attributes?.customer_email ||
        event?.meta?.customer_email;
    if (!emailFromPayload) return null;
    const normalizedEmail = String(emailFromPayload).trim().toLowerCase();
    return User.findOne({ email: normalizedEmail });
}
const verifySignature = (rawBody, signature, secret) => {
    try {
        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(rawBody).digest('hex');
        return crypto.timingSafeEqual(
            Buffer.from(digest, 'hex'),
            Buffer.from(signature, 'hex')
        );
    } catch (e) {
        return false;
    }
};
router.post('/lemonsqueezy', async (req, res) => {
    const secret    = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const signature = req.headers['x-signature'];

    // ── 1. Guard: secret must be configured ──────────────────
    if (!secret) {
        console.error('❌ LEMONSQUEEZY_WEBHOOK_SECRET env var is not set');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // ── 2. Guard: signature header must be present ───────────
    if (!signature) {
        console.warn('⚠️ Webhook received without x-signature header');
        return res.status(400).json({ error: 'Missing x-signature header' });
    }

    // ── 3. Verify signature ───────────────────────────────────
    const rawBody = req.body; // Buffer (express.raw applied in server.js)
    const valid   = verifySignature(rawBody, signature, secret);

    if (!valid) {
        console.error('❌ Invalid webhook signature — possible spoofed request');
        return res.status(401).json({ error: 'Invalid signature' });
    }

    // ── 4. Parse JSON ─────────────────────────────────────────
    let event;
    try {
        event = JSON.parse(rawBody.toString('utf8'));
    } catch {
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    const eventName  = event.meta?.event_name || 'unknown_event';
    const data       = event.data;
    const customData = event.meta?.custom_data;
    const userId     = customData?.user_id;
    const eventId    = req.headers['x-event-id'] || signature;

    // ── 5. Always respond 200 quickly, process async ──────────
    res.status(200).json({ received: true });

    // ── 6. Process event (Async with Audit Logging) ───────────
    (async () => {
        let webhookRecord;
        try {
            // Idempotency check
            webhookRecord = await WebhookEvent.findOne({ eventId });
            if (webhookRecord && webhookRecord.status === 'success') {
                console.log(`♻️ Webhook event ${eventId} already processed successfully. Skipping.`);
                return;
            }

            if (!webhookRecord) {
                webhookRecord = await WebhookEvent.create({
                    eventId,
                    eventName,
                    status: 'pending',
                    payload: event
                });
            }

            switch (eventName) {

                // ── Subscription created / updated ────────────────
                case 'subscription_created':
                case 'subscription_updated': {
                    const resolvedUser = await resolveUserFromEvent(event, data, userId);
                    if (!resolvedUser) {
                        throw new Error(`CRITICAL: No user_id or customer email found for subscription event. Data: ${JSON.stringify(data?.attributes)}`);
                    }
                    if (!userId && resolvedUser) {

                    }

                    const variantId  = String(data?.attributes?.variant_id ?? '');
                    const planInfo   = VARIANT_PLAN_MAP[variantId];

                    if (!planInfo) {
                        throw new Error(`CRITICAL: Unknown variant ID: ${variantId}`);
                    }

                    const status         = data?.attributes?.status;          // 'active' | 'paused' | etc.
                    const renewsAt       = data?.attributes?.renews_at;
                    const subscriptionId = String(data?.id ?? '');
                    const customerId     = String(data?.attributes?.customer_id ?? '');
                    const cancelled      = data?.attributes?.cancelled ?? false;

                    const user = resolvedUser;

                    user.plan = planInfo.plan;
                    user.subscription = {
                        status:                    status === 'active' ? 'active' : status,
                        lemonSqueezyCustomerId:    customerId,
                        lemonSqueezySubscriptionId: subscriptionId,
                        currentPeriodStart:        new Date(),
                        currentPeriodEnd:          renewsAt ? new Date(renewsAt) : null,
                        cancelAtPeriodEnd:         cancelled,
                        canceledAt:                cancelled ? new Date() : null,
                        interval:                  planInfo.interval,
                    };

                    const limits = getPlanLimits(planInfo.plan);
                    user.limits.linksPerMonth    = limits.linksPerMonth;
                    user.limits.apiRequestsPerDay = limits.apiRequestsPerDay;

                    await user.save();

                    break;
                }

                // ── Subscription cancelled (still active until period end) ──
                case 'subscription_cancelled': {
                    const userCancel = await resolveUserFromEvent(event, data, userId);
                    if (!userCancel) {
                        throw new Error(`CRITICAL: No user found for subscription_cancelled. Data: ${JSON.stringify(data?.attributes)}`);
                    }

                    if (!userCancel.subscription) userCancel.subscription = {};
                    userCancel.subscription.cancelAtPeriodEnd = true;
                    userCancel.subscription.canceledAt        = new Date();
                    userCancel.subscription.status            = 'canceled';

                    await userCancel.save();
                    console.log(`⚠️ Subscription cancelled for user ${userCancel._id} (active until period end)`);
                    break;
                }

                // ── Subscription expired (period ended after cancellation) ──
                case 'subscription_expired': {
                    const userExp = await resolveUserFromEvent(event, data, userId);
                    if (!userExp) {
                        throw new Error(`CRITICAL: No user found for subscription_expired. Data: ${JSON.stringify(data?.attributes)}`);
                    }

                    userExp.plan = 'free';
                    if (!userExp.subscription) userExp.subscription = {};
                    userExp.subscription.status = 'canceled';

                    const freeLimits = getPlanLimits('free');
                    userExp.limits.linksPerMonth    = freeLimits.linksPerMonth;
                    userExp.limits.apiRequestsPerDay = freeLimits.apiRequestsPerDay;

                    await userExp.save();
                    console.log(`📉 Subscription expired for user ${userExp._id} → reverted to free`);
                    break;
                }

                // ── Subscription payment success (renew) ──────────
                case 'subscription_payment_success': {
                    const userPay = await resolveUserFromEvent(event, data, userId);
                    if (!userPay) {
                        throw new Error(`CRITICAL: No user found for subscription_payment_success. Data: ${JSON.stringify(data?.attributes)}`);
                    }

                    const renewsAt = data?.attributes?.renews_at;
                    if (!userPay.subscription) userPay.subscription = {};
                    userPay.subscription.status         = 'active';
                    userPay.subscription.cancelAtPeriodEnd = false;
                    if (renewsAt) userPay.subscription.currentPeriodEnd = new Date(renewsAt);

                    await userPay.save();

                    break;
                }

                // ── Subscription payment failed ───────────────────
                case 'subscription_payment_failed': {
                    const userFail = await resolveUserFromEvent(event, data, userId);
                    if (!userFail) {
                        throw new Error(`CRITICAL: No user found for subscription_payment_failed. Data: ${JSON.stringify(data?.attributes)}`);
                    }

                    if (!userFail.subscription) userFail.subscription = {};
                    userFail.subscription.status = 'past_due';

                    await userFail.save();

                    break;
                }

                // ── Subscription resumed ──────────────────────────
                case 'subscription_resumed': {
                    const userRes = await resolveUserFromEvent(event, data, userId);
                    if (!userRes) {
                        throw new Error(`CRITICAL: No user found for subscription_resumed. Data: ${JSON.stringify(data?.attributes)}`);
                    }

                    if (!userRes.subscription) userRes.subscription = {};
                    userRes.subscription.status            = 'active';
                    userRes.subscription.cancelAtPeriodEnd = false;
                    userRes.subscription.canceledAt        = null;

                    await userRes.save();

                    break;
                }

                // ── Digital Product / Paywall Order Created ──────────────────
                case 'order_created': {
                    const creatorId = customData?.user_id;
                    const blockId = customData?.block_id;

                    if (!creatorId) {
                        console.warn('⚠️ Order received without user_id in custom_data');
                        break;
                    }

                    const Order = require('../models/Order');
                    const orderStatus = data?.attributes?.status; // 'paid', 'pending', etc.
                    
                    await Order.create({
                        creatorId,
                        customerEmail: data?.attributes?.user_email || data?.attributes?.customer_email,
                        productId: String(data?.attributes?.product_id),
                        variantId: String(data?.attributes?.variant_id),
                        orderId: String(data?.id),
                        status: orderStatus === 'paid' ? 'paid' : 'pending',
                        amount: data?.attributes?.total,
                        currency: data?.attributes?.currency,
                        blockId,
                        metadata: customData
                    });

                    // Future: Trigger email to customer with link/file
                    break;
                }

                default:
                    console.log(`ℹ️ Unhandled webhook event: ${eventName}`);
            }

            // Success
            webhookRecord.status = 'success';
            webhookRecord.processed = true;
            await webhookRecord.save();

        } catch (err) {
            console.error('❌ Webhook processing error:', err.message, err.stack);
            if (webhookRecord) {
                webhookRecord.status = 'error';
                webhookRecord.errorDetails = err.message + '\n' + (err.stack || '');
                await webhookRecord.save().catch(e => console.error('Failed to save webhook error state', e));
            }
        }
    })();
});
router.post('/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
        console.warn('⚠️ STRIPE_WEBHOOK_SECRET is not set');
        return res.status(400).send('Webhook Error: Secret not set');
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('❌ Stripe Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    res.status(200).json({ received: true });

    (async () => {
        try {
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                
                // We stored metadata in payments.js
                const { creatorId, blockId, username } = session.metadata || {};
                
                if (creatorId && blockId) {
                    const Order = require('../models/Order');
                    
                    await Order.create({
                        creatorId,
                        customerEmail: session.customer_details?.email || session.customer_email || 'unknown@example.com',
                        productId: 'stripe_digital_product',
                        variantId: blockId,
                        orderId: session.id,
                        status: 'paid',
                        amount: session.amount_total ? session.amount_total / 100 : 0,
                        currency: session.currency || 'usd',
                        blockId,
                        metadata: session.metadata
                    });

                }
            }
        } catch (err) {
            console.error('❌ Stripe Webhook processing error:', err.message);
        }
    })();
});

module.exports = router;
