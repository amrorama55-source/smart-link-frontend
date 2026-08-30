const { createClient } = require('@clickhouse/client');

const host = process.env.CLICKHOUSE_HOST || '';
const password = process.env.CLICKHOUSE_PASSWORD || '';
const username = process.env.CLICKHOUSE_USER || 'default';

// Construct URL ensuring correct prefix
const url = host.startsWith('http') ? host : `https://${host}:8443`;

const clickhouse = createClient({
  url: host ? url : 'http://localhost:8123',
  username: username,
  password: password,
  database: 'default',
  clickhouse_settings: {
    max_execution_time: 30, // 30s timeout for safety
  }
});

console.log('🔌 ClickHouse Client initialized targeting:', host ? url : 'localhost');

module.exports = clickhouse;
