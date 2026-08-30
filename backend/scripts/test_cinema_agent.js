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

async function testAgent() {
  console.log('🤖 Initializing Gemini AI Cinema Analyst Test...');
  if (!API_KEY) {
    console.error('❌ GEMINI_API_KEY missing in .env file!');
    process.exit(1);
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

    const testMessage = "Which 3 countries generated the most clicks for the dune-part-3 trailer?";
    const contents = [
      {
        role: 'user',
        parts: [{ text: testMessage }]
      }
    ];

    let result = await model.generateContent({ contents });
    
    while (true) {
      const functionCalls = result.response.functionCalls();
      if (!functionCalls || functionCalls.length === 0) {
        break;
      }
      
      const call = functionCalls[0];
      console.log(`🛠️ Tool Call Detected: ${call.name}`);
      console.log(`   Arguments:`, call.args);
      
      let toolResult;
      if (call.name === 'get_clicks_schema') {
        toolResult = {
          table: "clicks",
          description: "Logs real-time blockbuster campaign click traffic events.",
          columns: [
            { name: "id", type: "UUID", description: "Unique click identifier" },
            { name: "symbol", type: "String", description: "The link shortcode slug, e.g. dune-part-3" },
            { name: "country", type: "String", description: "Two-letter country code of the viewer, e.g. SA, US, CA" },
            { name: "device", type: "String", description: "Visitor device: Mobile, Desktop, Tablet" },
            { name: "referrer", type: "String", description: "Traffic source: Twitter, YouTube, Facebook, TikTok, Direct" },
            { name: "is_bot", type: "UInt8", description: "1 if click was by a bot/crawler, 0 if human viewer" },
            { name: "timestamp", type: "DateTime", description: "Click event date and time" }
          ]
        };
      } else if (call.name === 'query_clicks_analytics') {
        const sql = call.args.sql;
        console.log(`🚀 ClickHouse: Executing query [${sql}]`);
        const resultSet = await clickhouse.query({
          query: sql,
          format: 'JSONEachRow'
        });
        const rows = await resultSet.json();
        console.log(`📊 Query Results (${rows.length} rows returned):`, rows.slice(0, 3));
        toolResult = { success: true, rows };
      }
      
      // Append the model's functionCall turn to history
      contents.push(result.response.candidates[0].content);

      // Append the user's functionResponse turn
      contents.push({
        role: 'user',
        parts: [{
          functionResponse: {
            name: call.name,
            response: toolResult
          }
        }]
      });

      console.log(`🔄 Sending tool results back to Gemini...`);
      result = await model.generateContent({ contents });
    }
    
    console.log(`🤖 Gemini Final Answer:`);
    console.log(result.response.text());
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
  } finally {
    try {
      await clickhouse.close();
    } catch (e) {}
  }
}

testAgent();
