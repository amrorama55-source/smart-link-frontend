const axios = require('axios');

/**
 * Sends a webhook notification when a link is clicked.
 * 
 * @param {string} url - The webhook URL provided by the user.
 * @param {object} payload - The click data payload to send.
 */
const triggerWebhook = async (url, payload) => {
  if (!url) return;

  try {
    await axios.post(url, {
      event: 'link.clicked',
      timestamp: new Date().toISOString(),
      data: payload
    }, {
      timeout: 5000, // 5 second timeout so it doesn't hang
      headers: {
        'User-Agent': 'SmartLink-Webhook-System/1.0',
        'Content-Type': 'application/json'
      }
    });
    console.log(`✅ Webhook delivered to ${url}`);
  } catch (error) {
    // Log failure but do not crash the app
    console.error(`❌ Webhook delivery failed to ${url}:`, error.message);
  }
};

module.exports = {
  triggerWebhook
};
