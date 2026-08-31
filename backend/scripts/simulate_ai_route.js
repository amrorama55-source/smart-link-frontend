require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const clickhouse = require('../utils/clickhouse');

const API_KEY = (process.env.GEMINI_API_KEY || '').trim();

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

async function simulate() {
  const message = "Run this exact SQL query on clicks table and return the results: SELECT referrer, count(*) as clicks FROM clicks GROUP BY referrer ORDER BY clicks DESC";
  const chatHistory = [];

  console.log(`🤖 Simulating route execution for message: "${message}"`);
  
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

    const formattedHistory = (chatHistory || []).map(h => ({
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

      console.log(`🤖 Cinema Agent calling tool: ${toolName}`, args);
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

      contents.push(result.response.candidates[0].content);

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

    console.log('✅ Simulation completed successfully!');
    console.log('Reply:', responseText);
    console.log('Tool Executions:', JSON.stringify(toolExecutions, null, 2));

  } catch (err) {
    console.error('❌ SIMULATION ERROR STACK TRACE:');
    console.error(err);
  } finally {
    process.exit(0);
  }
}

simulate();
