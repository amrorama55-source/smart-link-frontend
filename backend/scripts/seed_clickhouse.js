require('dotenv').config();
const clickhouse = require('../utils/clickhouse');
const crypto = require('crypto');

async function run() {
  console.log('⚡ ClickHouse Seeding Initializing...');
  
  const referrers = ['Twitter', 'YouTube', 'Facebook', 'TikTok', 'Direct'];
  const devices = ['Mobile', 'Desktop', 'Tablet'];
  const countries = ['SA', 'US', 'GB', 'AE', 'CA', 'JP', 'FR', 'DE', 'EG', 'JO'];
  const symbols = ['avatar-3', 'dune-part-3', 'mi-8-trailer', 'gladiator-2'];
  
  const totalRows = 50000;
  const batchSize = 10000;
  
  console.log(`🎬 Generating ${totalRows} mock movie trailer click events...`);
  
  try {
    for (let b = 0; b < totalRows; b += batchSize) {
      const values = [];
      for (let i = 0; i < batchSize; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const referrer = referrers[Math.floor(Math.random() * referrers.length)];
        const device = devices[Math.floor(Math.random() * devices.length)];
        const country = countries[Math.floor(Math.random() * countries.length)];
        const is_bot = Math.random() < 0.15 ? 1 : 0; // 15% bot clicks
        
        // Random date in the last 7 days
        const daysAgo = Math.random() * 7;
        const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');
          
        values.push({
          id: crypto.randomUUID(),
          symbol,
          country,
          device,
          referrer,
          is_bot,
          timestamp
        });
      }
      
      console.log(`🚀 Inserting batch ${b / batchSize + 1} of ${totalRows / batchSize}...`);
      await clickhouse.insert({
        table: 'clicks',
        values: values,
        format: 'JSONEachRow'
      });
    }
    
    console.log('✅ ClickHouse successfully seeded with 50,000 blockbuster marketing events! 🎉');
  } catch (err) {
    console.error('❌ ClickHouse seeding failed:', err.message);
  } finally {
    await clickhouse.close();
    process.exit(0);
  }
}

run();
