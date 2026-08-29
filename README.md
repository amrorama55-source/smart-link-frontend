# Smart Link - Advanced Link Management System

Welcome to the Smart Link project! This is a comprehensive, production-ready link management platform featuring a robust backend API and a modern frontend dashboard.

## Project Structure

- **`/frontend`**: The React-based user interface. Built with Vite, modern styling, and React Router.
- **`/backend`**: The Node.js and Express backend API. Handles authentication, routing, link analytics, and database interactions with MongoDB.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)
- Google OAuth (optional, for social login)

### Setup Instructions

1. **Environment Variables**
   - In both `/frontend` and `/backend` directories, you will find a `.env.example` file.
   - Rename these to `.env` and fill in your specific configuration details (Database URI, JWT secret, etc.).

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Features
- Advanced link tracking and detailed analytics
- User authentication & subscription tiers (Free, Premium, Enterprise)
- Link Targeting (geo-location, device, language)
- A/B testing support
- Custom domains configuration

---
*This repository has been cleaned of all temporary development files and sensitive credentials, making it fully ready for distribution or deployment.*
