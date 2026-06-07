import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

// Prerenderer plugin (generates static HTML for each route at build time)
// Runs LOCALLY only — Vercel does not support Puppeteer (missing libnspr4.so etc.)
// Deploy with: npm run build && vercel --prebuilt --prod
let PrerenderPlugin;
try {
  PrerenderPlugin = require('@prerenderer/rollup-plugin');
  if (PrerenderPlugin.default) PrerenderPlugin = PrerenderPlugin.default;
} catch (e) {
  // Not installed or not available — skip silently
}

const IS_VERCEL = !!process.env.VERCEL;

const prerenderRoutes = [
  '/',
  '/faq',
  '/pricing',
  '/blog',
  '/for-creators',
  '/for-marketers',
  '/for-ecommerce',
  '/for-affiliates',
  '/terms',
  '/privacy',
];

const prerenderPlugin = (!IS_VERCEL && PrerenderPlugin)
  ? new PrerenderPlugin({
      routes: prerenderRoutes,
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterDocumentEvent: 'render-event',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    })
  : null;

export default defineConfig({
  plugins: [react(), ...(prerenderPlugin ? [prerenderPlugin] : [])],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})

