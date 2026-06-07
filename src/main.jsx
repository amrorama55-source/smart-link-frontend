import React from 'react';
import ReactDOM from 'react-dom/client';
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

// Signal to the prerenderer (during build) that React has fully mounted.
// This fires the 'render-event' which @prerenderer/renderer-puppeteer waits for
// before taking the HTML snapshot. Has zero effect in normal browser usage.
document.dispatchEvent(new Event('render-event'));






