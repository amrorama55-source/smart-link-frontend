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

const { GoogleGenerativeAI } = require('@google/generative-ai');
const clickhouse = require('../utils/clickhouse');

const cinemaTools = {
  functionDeclarations: [
    {
      name: "get_clicks_schema",
      description: "Returns the column structure of the clicks analytics table. Use this to understand what fields are queryable.",
      parameters: { type: "OBJECT", properties: {} }
    },
    {
      name: "query_clicks_analytics",
      description: "Execute a read-only SQL SELECT query on the clicks table to fetch real-time blockbuster performance metrics. Never run modifying queries (INSERT/UPDATE/DELETE/DROP).",
      parameters: {
        type: "OBJECT",
        properties: {
          sql: { type: "STRING", description: "The raw SQL SELECT query to run, e.g. SELECT referrer, count(*) FROM clicks GROUP BY referrer" }
        },
        required: ["sql"]
      }
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// POST /cinema-chat
// ═══════════════════════════════════════════════════════════════
router.post('/cinema-chat', verifyToken, async (req, res) => {
  const { message, chatHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  // ✅ BYPASS GEMINI FOR MANUAL SQL RUNS: Direct ClickHouse execution to conserve daily API quota!
  if (message.startsWith('Run this exact SQL query on clicks table and return the results:')) {
    const sql = message.replace('Run this exact SQL query on clicks table and return the results:', '').trim();
    console.log(`⚡ Direct SQL Console Execution: [${sql}]`);
    try {
      const isModifying = /insert|update|delete|drop|alter|truncate/i.test(sql);
      if (isModifying) {
        throw new Error("Modifying queries are restricted for security.");
      }
      const resultSet = await clickhouse.query({
        query: sql,
        format: 'JSONEachRow'
      });
      const rows = await resultSet.json();
      return res.json({
        success: true,
        reply: "Query executed successfully.",
        toolExecutions: [
          { tool: 'query_clicks_analytics', status: 'success', sql, data: { success: true, rows } }
        ]
      });
    } catch (err) {
      console.error('❌ Direct SQL failed:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // ✅ BYPASS GEMINI FOR MOUNT QUERY 1: Total click count & bot percentage
  if (message.includes("Run a query to get the total count of clicks and the percentage of clicks where is_bot = 1")) {
    console.log("⚡ Direct SQL Bypass: Total clicks stats");
    try {
      const resultSet = await clickhouse.query({
        query: "SELECT count(*) as total, sum(is_bot=1) as bots FROM clicks",
        format: 'JSONEachRow'
      });
      const rows = await resultSet.json();
      const total = rows[0]?.total || 0;
      const bots = rows[0]?.bots || 0;
      const botPct = total > 0 ? ((bots / total) * 100).toFixed(2) : 0;
      return res.json({
        success: true,
        reply: `Based on ClickHouse real-time analytics, we have tracked a total of **${Number(total).toLocaleString()}** clicks with a bot traffic rate of **${botPct}%** (representing ${Number(bots).toLocaleString()} automated hits).`,
        toolExecutions: [
          { tool: 'query_clicks_analytics', status: 'success', sql: 'SELECT count(*) as total, sum(is_bot=1) as bots FROM clicks', data: { success: true, rows } }
        ]
      });
    } catch (err) {
      console.error('❌ Direct Total Clicks SQL failed:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // ✅ BYPASS GEMINI FOR MOUNT QUERY 2: Referrer counts breakdown
  if (message.includes("Provide a raw breakdown of referrer counts as a SQL query")) {
    console.log("⚡ Direct SQL Bypass: Referrer counts");
    try {
      const resultSet = await clickhouse.query({
        query: "SELECT referrer, count(*) as clicks FROM clicks GROUP BY referrer ORDER BY clicks DESC",
        format: 'JSONEachRow'
      });
      const rows = await resultSet.json();
      return res.json({
        success: true,
        reply: "Query executed successfully.",
        toolExecutions: [
          { tool: 'query_clicks_analytics', status: 'success', sql: 'SELECT referrer, count(*) as clicks FROM clicks GROUP BY referrer ORDER BY clicks DESC', data: { success: true, rows } }
        ]
      });
    } catch (err) {
      console.error('❌ Direct Referrer Counts SQL failed:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      systemInstruction: `You are CinemaLink AI, an expert autonomous data analyst agent for film marketing.
You are equipped with tools to query real-time clickstream data in ClickHouse (clicks table).
Always write clean, optimized ClickHouse SQL.
If the user asks a question about metrics (traffic, referrers, device count, bots, geographic breakdown), use query_clicks_analytics.
Before running any query, you may call get_clicks_schema to check the columns.
Explain your analysis clearly and summarize findings for film studios.`,
      tools: [cinemaTools]
    });

    const formattedHistory = (chatHistory || [])
      .filter(h => h.content && !h.content.startsWith('❌ Error')) // Safeguard: Filter out error/timeout messages from history
      .map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      }));

    const contents = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    let result = await model.generateContent({ contents });
    let responseText = '';
    let toolExecutions = [];

    while (true) {
      const functionCalls = result.response.functionCalls();
      if (!functionCalls || functionCalls.length === 0) {
        responseText = result.response.text();
        break;
      }

      const call = functionCalls[0];
      const toolName = call.name;
      const args = call.args;

      console.log(`🤖 Cinema Agent calling: ${toolName}`, args);
      let toolResult;

      try {
        if (toolName === 'get_clicks_schema') {
          toolResult = {
            table: "clicks",
            description: "Logs real-time blockbuster campaign click traffic events.",
            columns: [
              { name: "id", type: "UUID", description: "Unique click identifier" },
              { name: "symbol", type: "String", description: "The link shortcode slug, e.g. MI-trailer" },
              { name: "country", type: "String", description: "Two-letter country code of the viewer, e.g. SA, US, CA" },
              { name: "device", type: "String", description: "Visitor device: Mobile, Desktop, Tablet" },
              { name: "referrer", type: "String", description: "Traffic source: Twitter, YouTube, Facebook, TikTok, Direct" },
              { name: "is_bot", type: "UInt8", description: "1 if click was by a bot/crawler, 0 if human viewer" },
              { name: "timestamp", type: "DateTime", description: "Click event date and time" }
            ]
          };
          toolExecutions.push({ tool: 'get_clicks_schema', status: 'success', data: toolResult });

        } else if (toolName === 'query_clicks_analytics') {
          // Block raw modification keywords for security safety
          const isModifying = /insert|update|delete|drop|alter|truncate/i.test(args.sql);
          if (isModifying) {
            throw new Error("Modifying queries are restricted for security.");
          }

          console.log(`🚀 ClickHouse: Executing query [${args.sql}]`);
          const resultSet = await clickhouse.query({
            query: args.sql,
            format: 'JSONEachRow'
          });
          const rows = await resultSet.json();

          toolResult = {
            success: true,
            rows: rows
          };
          toolExecutions.push({ tool: 'query_clicks_analytics', status: 'success', sql: args.sql, data: toolResult });
        }
      } catch (toolErr) {
        console.error(`❌ Cinema Tool failed:`, toolErr.message);
        toolResult = { success: false, error: toolErr.message };
        toolExecutions.push({ tool: toolName, status: 'failed', error: toolErr.message });
      }

      // Append model turn to history
      contents.push(result.response.candidates[0].content);

      // Append user turn containing the functionResponse
      contents.push({
        role: 'user',
        parts: [{
          functionResponse: {
            name: toolName,
            response: toolResult
          }
        }]
      });

      console.log(`🔄 Sending tool results back to Gemini...`);
      result = await model.generateContent({ contents });
    }

    return res.json({
      success: true,
      reply: responseText,
      toolExecutions
    });

  } catch (err) {
    console.error('❌ Cinema AI Agent error:', err);
    return res.status(500).json({ error: 'AI Agent failed to process message', details: err.message });
  }
});

module.exports = router;

