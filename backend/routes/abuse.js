const express = require('express');
const router = express.Router();
const escapeHtml = require('../utils/escapeHtml');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Simple limiter specifically for abuse reports to prevent spam
const abuseLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60 * 60, // 5 requests per hour
  blockDuration: 60 * 60
});

router.get('/', (req, res) => {
  const shortCode = escapeHtml(req.query.shortCode || '');
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>🛡️ Report Abuse - Smart Link</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f7fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }
        .card {
          background: white;
          max-width: 500px;
          width: 100%;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          text-align: center;
        }
        h1 { color: #2d3748; margin-bottom: 16px; }
        p { color: #718096; line-height: 1.6; margin-bottom: 30px; }
        .btn {
          display: inline-block;
          background: #3182ce;
          color: white;
          padding: 12px 24px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
        }
        .btn:hover { background: #2b6cb0; }
        .form-group { text-align: left; margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; color: #4a5568; font-weight: 600; }
        input, textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-family: inherit;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🛡️ Report Abuse</h1>
        <p>We take security seriously. If you've encountered a phishing, malware, or spam link, please let us know.</p>
        
        <form action="/api/abuse/submit" method="POST">
          <div class="form-group">
            <label>Reported URL / ShortCode</label>
            <input type="text" name="url" value="${shortCode}" placeholder="e.g. boligbyggelagetusbl" required>
          </div>
          <div class="form-group">
            <label>Reason for report</label>
            <textarea name="reason" rows="3" placeholder="Phishing, Malware, Spam..." required></textarea>
          </div>
          <button type="submit" class="btn" style="border:none; cursor:pointer; width:100%;">Submit Report</button>
        </form>
        
        <div style="margin-top: 24px; font-size: 13px; color: #a0aec0;">
          Or email us directly at <a href="mailto:abuse@by-smartlink.com">abuse@by-smartlink.com</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

router.post('/submit', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip;
    
    // Check rate limit
    try {
      await abuseLimiter.consume(ip);
    } catch (rejRes) {
      return res.status(429).send('Too many reports. Please try again later.');
    }

    const url = escapeHtml(req.body.url || '');
    const reason = escapeHtml(req.body.reason || '');

    if (!url || !reason) {
      return res.status(400).send('URL and reason are required.');
    }

    // In a real app, you would send an email here or save to DB.
    console.log(`🚨 ABUSE REPORT RECEIVED 🚨\nURL: ${url}\nReason: ${reason}\nIP: ${ip}`);

    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #38a169;">Report Submitted ✅</h1>
        <p>Thank you for keeping our platform safe. Our team will review this shortly.</p>
        <a href="/" style="color: #3182ce; text-decoration: none;">Return to Home</a>
      </div>
    `);
  } catch (error) {
    console.error('Abuse submission error:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
