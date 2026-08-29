// Send email function using Brevo with timeout and automatic retry fallback
const sendEmail = async ({ to, subject, html, bcc }, retriesLeft = 1) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.warn('⚠️ BREVO_API_KEY missing - skipping email send to:', to);
      return { success: false, error: 'BREVO_API_KEY is missing' };
    }

    const payload = {
      sender: {
        name: 'Smart Link',
        email: process.env.EMAIL_FROM || 'noreply@by-smartlink.com'
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html
    };

    if (bcc) {
      payload.bcc = [{ email: bcc }];
    }

    // 10-second timeout controller to prevent HTTP requests from hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const result = await response.json();

    if (response.ok) {
      return { success: true, messageId: result.messageId };
    } else {
      console.error('❌ Brevo API error:', result);
      if (retriesLeft > 0) {
        console.log('🔄 Retrying email send once...');
        return await sendEmail({ to, subject, html, bcc }, retriesLeft - 1);
      }
      return { success: false, error: result.message || 'Unknown Brevo error' };
    }
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    if (retriesLeft > 0 && error.name !== 'AbortError') {
      console.log('🔄 Retrying email send once after exception...');
      return await sendEmail({ to, subject, html, bcc }, retriesLeft - 1);
    }
    return { success: false, error: error.message };
  }
};


/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  console.log('🔗 Password reset URL:', resetUrl);
  console.log('📧 Sending password reset to:', email);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6; 
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f3f4f6;
        }
        .container { 
          max-width: 600px; 
          margin: 40px auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white; 
          padding: 40px 20px; 
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content { 
          padding: 40px 30px;
        }
        .content p {
          margin: 0 0 16px 0;
          color: #4b5563;
        }
        .button { 
          display: inline-block; 
          background: #3b82f6;
          color: white !important;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          margin: 24px 0;
          font-weight: 600;
          font-size: 16px;
        }
        .button:hover {
          background: #2563eb;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .link-box {
          background: #f9fafb;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          word-break: break-all;
          font-size: 14px;
          color: #6b7280;
          margin: 20px 0;
        }
        .warning {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 16px;
          margin: 24px 0;
          border-radius: 4px;
        }
        .warning strong {
          color: #92400e;
        }
        .footer { 
          text-align: center; 
          color: #9ca3af;
          font-size: 13px;
          padding: 30px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Reset Your Password</h1>
        </div>
        <div class="content">
          <p style="font-size: 18px; font-weight: 600; color: #111827;">Hi ${userName || 'there'},</p>
          <p>We received a request to reset your password for your Smart Link account.</p>
          <p>Click the button below to create a new password:</p>
          
          <div class="button-container">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">Or copy and paste this link into your browser:</p>
          <div class="link-box">${resetUrl}</div>
          
          <div class="warning">
            <strong>⏰ Important:</strong> This link will expire in 1 hour for security reasons.
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class="footer">
          <p><strong>Smart Link</strong></p>
          <p>© ${new Date().getFullYear()} Smart Link. All rights reserved.</p>
          <p style="margin-top: 10px;">This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🔐 Reset Your Password - Smart Link',
    html
  });
};

/**
 * Send email verification
 */
const sendVerificationEmail = async (email, verificationToken, userName) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  console.log('📧 Sending verification email to:', email);
  console.log('🔗 Verification URL:', verifyUrl);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6; 
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f3f4f6;
        }
        .container { 
          max-width: 600px; 
          margin: 40px auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white; 
          padding: 40px 20px; 
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content { 
          padding: 40px 30px;
        }
        .content p {
          margin: 0 0 16px 0;
          color: #4b5563;
        }
        .button { 
          display: inline-block; 
          background: #10b981;
          color: white !important;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          margin: 24px 0;
          font-weight: 600;
          font-size: 16px;
        }
        .button:hover {
          background: #059669;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .link-box {
          background: #f9fafb;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          word-break: break-all;
          font-size: 14px;
          color: #6b7280;
          margin: 20px 0;
        }
        .welcome-box {
          background: #ecfdf5;
          border-left: 4px solid #10b981;
          padding: 20px;
          margin: 24px 0;
          border-radius: 4px;
        }
        .welcome-box h3 {
          margin: 0 0 10px 0;
          color: #065f46;
        }
        .welcome-box ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .welcome-box li {
          color: #047857;
          margin: 5px 0;
        }
        .footer { 
          text-align: center; 
          color: #9ca3af;
          font-size: 13px;
          padding: 30px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✉️ Verify Your Email</h1>
        </div>
        <div class="content">
          <p style="font-size: 18px; font-weight: 600; color: #111827;">Hi ${userName}! 👋</p>
          <p>Welcome to Smart Link! We're excited to have you on board.</p>
          <p>To get started and unlock all features, please verify your email address by clicking the button below:</p>
          
          <div class="button-container">
            <a href="${verifyUrl}" class="button">Verify Email Address</a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">Or copy and paste this link into your browser:</p>
          <div class="link-box">${verifyUrl}</div>
          
          <div class="welcome-box">
            <h3>🎉 What you can do with Smart Link:</h3>
            <ul>
              <li>Create and manage short links</li>
              <li>Track link analytics and clicks</li>
              <li>Build your custom bio page</li>
              <li>Access API for automation</li>
            </ul>
          </div>
          
          <p style="font-size: 13px; color: #9ca3af; margin-top: 24px;">
            <strong>Note:</strong> This verification link will expire in 24 hours.
          </p>
          
          <p style="font-size: 14px; color: #6b7280;">If you didn't create an account with Smart Link, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p><strong>Smart Link</strong></p>
          <p>© ${new Date().getFullYear()} Smart Link. All rights reserved.</p>
          <p style="margin-top: 10px;">Need help? Contact us at support@smartlink.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '✉️ Verify Your Email - Welcome to Smart Link!',
    html,
    bcc: 'by-smartlink.com+81531ea12f@invite.trustpilot.com'
  });
};

/**
 * Trial Day 1 Email - Welcome to Trial
 */
const sendTrialDay1Email = async (email, userName) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; background: #6366f1; color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 10px 0; font-weight: 600; }
        .features { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .features li { margin: 8px 0; color: #4b5563; }
        .footer { text-align: center; color: #9ca3af; font-size: 13px; padding: 30px; background: #f9fafb; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Welcome to Starter Free Trial!</h1>
        </div>
        <div class="content">
          <p style="font-size: 18px; font-weight: 600;">Hi ${userName}! 🎉</p>
          <p>Your 14-day Starter free trial is now active! Here are some things you can explore:</p>
          <div class="features">
            <strong>✨ What's included:</strong>
            <ul>
              <li>15 Smart Links / Month</li>
              <li>Real-Time Click Analytics</li>
              <li>Link Cloaking & Protection</li>
              <li>Bio Page Builder</li>
              <li>QR Code Generation</li>
              <li>Standard SSL Protection</li>
            </ul>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Start Exploring</a>
          </p>
          <p style="color: #6b7280; font-size: 14px;">Need help? Reply to this email or check our FAQ.</p>
        </div>
        <div class="footer">
          <p><strong>Smart Link</strong></p>
          <p>© ${new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🚀 Welcome to Your 14-Day Starter Free Trial!',
    html
  });
};

/**
 * Trial Day 3 Email - Feature Spotlight
 */
const sendTrialDay3Email = async (email, userName) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 40px 30px; }
        .tip { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background: #3b82f6; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { text-align: center; color: #9ca3af; font-size: 13px; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💡 Pro Tip: Try A/B Testing</h1>
        </div>
        <div class="content">
          <p>Hi ${userName}!</p>
          <p>Did you know you can test which links perform better with A/B Testing?</p>
          <div class="tip">
            <strong>🎯 A/B Testing lets you:</strong>
            <ul>
              <li>Compare up to 3 link variations</li>
              <li>See real-time click data</li>
              <li>Automatically route traffic to the winner</li>
            </ul>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Try A/B Testing Now</a>
          </p>
          <p style="color: #6b7280; font-size: 14px;">Questions? Just reply to this email!</p>
        </div>
        <div class="footer">
          <p><strong>Smart Link</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '💡 Unlock More Clicks with A/B Testing',
    html
  });
};

/**
 * Trial Day 5 Email - Social Proof / Upgrade Reminder (Sent on day 12 - 2 days left)
 */
const sendTrialDay5Email = async (email, userName) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 40px 30px; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat-box { flex: 1; background: #fffbeb; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 32px; font-weight: bold; color: #d97706; }
        .button { display: inline-block; background: #f59e0b; color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0; }
        .footer { text-align: center; color: #9ca3af; font-size: 13px; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Only 2 Days Left!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName}!</p>
          <p>Your Starter free trial ends in 2 days. Don't lose access to these trial features:</p>
          <div class="stats">
            <div class="stat-box">
              <div class="stat-number">15</div>
              <div>Smart Links / Month</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">🛡️</div>
              <div>Link Cloaking</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">📊</div>
              <div>Click Analytics</div>
            </div>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/pricing" class="button">Upgrade Now - Keep Your Limits</a>
          </p>
          <p style="color: #6b7280; font-size: 14px;">Questions about upgrading? Reply and we're happy to help!</p>
        </div>
        <div class="footer">
          <p><strong>Smart Link</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '⏰ Your Starter Trial Ends in 2 Days!',
    html
  });
};

/**
 * Trial Day 7 (Final) Email - Last Chance (Sent on day 14)
 */
const sendTrialDay7Email = async (email, userName) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #fef2f2; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 40px 30px; }
        .urgent { background: #fef2f2; border: 2px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #ef4444; color: white !important; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 18px; }
        .footer { text-align: center; color: #9ca3af; font-size: 13px; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Final Day - Trial Expires Today!</h1>
        </div>
        <div class="content">
          <p>Hi ${userName}!</p>
          <div class="urgent">
            <strong>⚠️ Today is your LAST day on Starter free trial.</strong>
            <p style="margin-top: 10px;">After today, you'll be downgraded to the free tier (5 links / month limit) and lose access to:</p>
            <ul>
              <li>15 Smart Links / Month (reduced to 5)</li>
              <li>Link Cloaking & Protection</li>
              <li>Bio Page Builder custom themes</li>
              <li>Detailed Click Analytics</li>
            </ul>
          </div>
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/pricing" class="button">Upgrade to Keep Starter</a>
          </p>
          <p style="color: #6b7280; font-size: 14px;">Need more time? Reply and we can help!</p>
        </div>
        <div class="footer">
          <p><strong>Smart Link</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🚨 URGENT: Your Starter Trial Expires Today!',
    html
  });
};

/**
 * Send trial expiry notification
 */
const sendTrialExpiredEmail = async (email, userName) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; background: #6b7280; color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { text-align: center; color: #9ca3af; font-size: 13px; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Starter Trial Has Ended</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          <p>Your Starter free trial has ended. You have been placed on the basic free plan. You can upgrade anytime to Starter, Pro Affiliate, or Agency Elite to unlock more limits and premium tracking features!</p>
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/pricing" class="button">View Upgrade Options</a>
          </p>
          <p style="color: #6b7280; font-size: 14px;">Questions? We're here to help!</p>
        </div>
        <div class="footer">
          <p><strong>Smart Link</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Your Starter Free Trial Has Ended',
    html
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendTrialDay1Email,
  sendTrialDay3Email,
  sendTrialDay5Email,
  sendTrialDay7Email,
  sendTrialExpiredEmail
};
