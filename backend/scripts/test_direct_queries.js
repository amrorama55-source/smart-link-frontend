require('dotenv').config();
const clickhouse = require('../utils/clickhouse');

async function test() {
  console.log('🔌 Running bypass query 1...');
  try {
    const res1 = await clickhouse.query({
      query: "SELECT count(*) as total, sum(is_bot=1) as bots FROM clicks",
      format: 'JSONEachRow'
    });
    const rows1 = await res1.json();
    console.log('✅ Query 1 Success:', rows1);
  } catch (err) {
    console.error('❌ Query 1 Failed:', err.message);
  }

  console.log('🔌 Running bypass query 2...');
  try {
    const res2 = await clickhouse.query({
      query: "SELECT referrer, count(*) as clicks FROM clicks GROUP BY referrer ORDER BY clicks DESC",
      format: 'JSONEachRow'
    });
    const rows2 = await res2.json();
    console.log('✅ Query 2 Success:', rows2);
  } catch (err) {
    console.error('❌ Query 2 Failed:', err.message);
  }

  process.exit(0);
}

test();
