require('dotenv').config();

const API_KEY = (process.env.GEMINI_API_KEY || '').trim();

async function listModels() {
  console.log('🔍 Querying active models...');
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();

    if (!listRes.ok) {
      console.error('❌ Failed:', listData);
      return;
    }

    console.log('✅ Found models:');
    const models = listData.models || [];
    for (const m of models) {
      console.log(`- ${m.name.replace('models/', '')} (${m.displayName}) - Supported Actions: ${m.supportedGenerationMethods.join(', ')}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

listModels();
