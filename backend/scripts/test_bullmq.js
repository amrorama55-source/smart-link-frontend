require('dotenv').config();
console.log('🔌 Importing analyticsWorker...');
try {
  require('../jobs/analyticsWorker');
  console.log('✅ analyticsWorker imported successfully!');
} catch (err) {
  console.error('❌ Failed to import analyticsWorker:', err.message);
}

setTimeout(() => {
  console.log('Exiting...');
  process.exit(0);
}, 5000);
