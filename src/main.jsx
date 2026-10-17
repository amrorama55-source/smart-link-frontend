import React from 'react';
import ReactDOM from 'react-dom/client';
import { initFrontendSentry } from './config/sentry';

// Sentry must be initialized before React renders
initFrontendSentry();

import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// The prerender 'render-event' is now dynamically dispatched by RenderTrigger in App.jsx






