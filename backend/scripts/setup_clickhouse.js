require('dotenv').config();
const clickhouse = require('../utils/clickhouse');

async function run() {
  console.log('⚡ Starting ClickHouse DDL schema setup...');
  
  const query = `
    CREATE TABLE IF NOT EXISTS clicks (
        id UUID,
        symbol String,
        country String,
        device String,
        referrer String,
        is_bot UInt8,
        timestamp DateTime
    ) ENGINE = MergeTree()
    ORDER BY (symbol, timestamp);
  `;

  try {
    await clickhouse.command({
      query: query,
      clickhouse_settings: {
        wait_end_of_query: 1
      }
    });
    console.log('✅ ClickHouse clicks table created successfully! 🎬');
  } catch (err) {
    console.error('❌ Failed to create clicks table in ClickHouse:', err.message);
  } finally {
    await clickhouse.close();
    process.exit(0);
  }
}

run();
