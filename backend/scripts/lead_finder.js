const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// ==========================================
// 🛠️ Configuration
// ==========================================

// 1. Enter your search query here. 
// Example: site:twitter.com "affiliate marketer"
// Example: site:linkedin.com "growth hacker"
const SEARCH_QUERY = 'site:twitter.com "affiliate marketer"'; 

// 2. Number of leads you want to fetch (Max 100 per request)
const NUM_RESULTS = 50; 

// 3. Date Range (e.g., 'qdr:d' for past 24 hours, 'qdr:w' for past week, 'qdr:m' for past month, or '' for anytime)
const DATE_RANGE = 'qdr:m'; // Default: past month to avoid old tweets

// ==========================================
// 🚀 Main Script
// ==========================================
async function findLeads() {
  console.log('🔍 Starting Lead Finder...');
  console.log(`🎯 Target: ${SEARCH_QUERY}`);

  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    console.error('❌ ERROR: SERPAPI_KEY not found in .env file!');
    console.log('👉 Please open the backend/.env file and add your key like this:');
    console.log('SERPAPI_KEY=your_private_api_key_here');
    process.exit(1);
  }

  try {
    console.log('⏳ Searching Google via SerpApi...');
    
    const params = {
      engine: 'google',
      q: SEARCH_QUERY,
      num: NUM_RESULTS,
      api_key: apiKey
    };

    // Add time filter if specified
    if (DATE_RANGE) {
      params.tbs = DATE_RANGE;
    }

    const response = await axios.get('https://serpapi.com/search.json', { params });

    const results = response.data.organic_results;

    if (!results || results.length === 0) {
      console.log('⚠️ No leads found for this query. Try a different search term.');
      return;
    }

    console.log(`✅ Found ${results.length} potential leads!`);
    
    // Format results to CSV
    let csvContent = 'Name/Title,Link,Description/Bio\n';

    results.forEach(lead => {
      // Clean up text to prevent CSV formatting issues (remove quotes, commas, newlines)
      const title = lead.title ? lead.title.replace(/"/g, '""').replace(/,/g, ' ') : '';
      const link = lead.link ? lead.link : '';
      const snippet = lead.snippet ? lead.snippet.replace(/"/g, '""').replace(/,/g, ' ').replace(/\n/g, ' ') : '';

      csvContent += `"${title}","${link}","${snippet}"\n`;
    });

    // Save to CSV file
    const outputPath = path.join(__dirname, 'leads.csv');
    fs.writeFileSync(outputPath, csvContent);

    console.log('🎉 SUCCESS! ---------------------------------');
    console.log(`📁 Your leads have been saved to: ${outputPath}`);
    console.log('👉 You can open leads.csv in Excel or Google Sheets.');
    console.log('--------------------------------------------');

  } catch (error) {
    console.error('❌ An error occurred during search:');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

findLeads();
