// Test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-link-test';
process.env.BASE_URL = 'http://localhost:3000';
process.env.FRONTEND_URL = 'http://localhost:5173';











