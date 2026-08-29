const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Link API',
      version: '2.0.0',
      description: `
Advanced URL shortening API with deep analytics, A/B testing, geo-targeting,
device targeting, retargeting pixels, bot protection, and affiliate tracking.

**Authentication:** Use a Bearer JWT token (from login/register) or an API Key (X-API-Key header).
      `.trim(),
      contact: {
        name: 'Smart Link Support',
        email: 'support@by-smartlink.com',
        url: 'https://by-smartlink.com'
      }
    },
    servers: [
      { url: 'https://api.by-smartlink.com', description: 'Production' },
      { url: 'http://localhost:8080', description: 'Local Development' }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token from POST /api/auth/login'
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key from Account Settings → API Access'
        }
      },
      schemas: {
        Link: {
          type: 'object',
          properties: {
            id:          { type: 'string',  example: '64abc123def456' },
            shortCode:   { type: 'string',  example: 'abc123' },
            shortUrl:    { type: 'string',  example: 'https://by-smartlink.com/abc123' },
            originalUrl: { type: 'string',  example: 'https://example.com/very-long-url' },
            title:       { type: 'string',  example: 'My Campaign Link' },
            totalClicks: { type: 'integer', example: 1250 },
            isActive:    { type: 'boolean', example: true },
            hasPassword: { type: 'boolean', example: false },
            qrCode:      { type: 'string',  description: 'Base64 QR code PNG' },
            createdAt:   { type: 'string',  format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error:   { type: 'string', example: 'Not Found' },
            message: { type: 'string', example: 'The requested resource was not found' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id:    { type: 'string',  example: '64abc123def456' },
            email: { type: 'string',  example: 'user@example.com' },
            name:  { type: 'string',  example: 'John Doe' },
            plan:  { type: 'string',  enum: ['free', 'starter', 'pro', 'business'], example: 'pro' }
          }
        }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: [path.join(__dirname, '../routes/*.js')]
};


const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
