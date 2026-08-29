const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken');

const API_KEY = (process.env.GEMINI_API_KEY || '').trim();

// AI Bio Page Generator - PRODUCTION STABLE VERSION
router.post('/generate-page', verifyToken, async (req, res) => {
  try {
    const { prompt, socialHandle } = req.body;
    if (!API_KEY) return res.status(400).json({ error: 'API Key Missing' });

    console.log(`🔍 Discovering stable models for account...`);

    // STEP 1: Get the list of ALL models
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();

    if (!listRes.ok) throw new Error(`Google API Failed: ${listData.error?.message}`);

    const allModels = (listData.models || []).map(m => m.name.replace('models/', ''));
    
    // STEP 2: Filter for ONLY STABLE production models (Skip experimental/new ones with 0 quota)
    const stablePriority = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-pro',
        'gemini-1.5-pro',
        'gemini-1.0-pro'
    ];

    const bestModel = stablePriority.find(p => allModels.includes(p)) || allModels[0];

    console.log(`🎯 Decision: Using STABLE model ${bestModel}`);

    const systemPrompt = `
      You are a professional web designer. Generate a high-end bio page JSON.
      Handle: @${socialHandle || 'user'}
      Intent: "${prompt}"

      Return ONLY JSON:
      {
        "displayName": "Name",
        "bio": "Bio content",
        "theme": "glass",
        "blocks": [
          { "type": "link", "title": "Label", "url": "https://...", "icon": "🌐" }
        ],
        "socialLinks": []
      }
    `;

    // STEP 3: Generate with the stable confirmed model
    const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${bestModel}:generateContent?key=${API_KEY}`;
    const genRes = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
    });

    const genData = await genRes.json();
    if (!genRes.ok) throw new Error(`Generation Failed: ${genData.error?.message}`);

    const text = genData.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI Response format");
    
    res.json({ success: true, data: JSON.parse(jsonMatch[0]), used_model: bestModel });

  } catch (err) {
    console.error('🔴 Builder Error:', err.message);
    res.status(500).json({ error: 'AI Generation failed', message: err.message });
  }
});

module.exports = router;
