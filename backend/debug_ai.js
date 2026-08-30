const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const models = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  console.log("Testing with GEMINI_API_KEY: " + process.env.GEMINI_API_KEY.substring(0, 10) + "...");

  for (const m of models) {
    try {
      console.log(`Testing model: ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Hello");
      const response = await result.response;
      console.log(`✅ Success with ${m}: `, response.text().substring(0, 50));
    } catch (err) {
      console.error(`❌ Failed with ${m}: `, err.message);
    }
  }
}

listModels();
