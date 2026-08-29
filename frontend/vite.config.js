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
  '/blog/arabic-link-optimization-2026',
  '/blog/why-stop-using-long-links-2026',
  '/blog/curiosity-vs-intent-2026',
  '/blog/smart-link-vs-linktree-2026',
  '/blog/10-best-link-in-bio-tools-tiktok-2026',
  '/blog/track-instagram-conversions-free',
  '/blog/smart-link-vs-beacons-2026',
  '/blog/bio-link-seo-guide-2026',
  '/blog/monetize-bio-link-2026',
  '/blog/best-bio-link-tools-arabic-2026',
  '/blog/increase-instagram-sales-2026-en',
  '/blog/increase-instagram-sales-2026-ar',
  '/blog/whatsapp-marketing-smart-link-ar',
  '/blog/how-to-monetize-bio-link-ar',
  '/blog/smart-link-vs-bitly-arabic',
  '/blog/increase-tiktok-followers-smart-links',
  '/blog/what-is-smart-link-ar',
  '/blog/what-is-smart-link-en',
  '/blog/free-saas-marketing-platforms-2026'
];

const prerenderPlugin = (!IS_VERCEL && PrerenderPlugin)
  ? new PrerenderPlugin({
      routes: prerenderRoutes,
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        renderAfterDocumentEvent: 'render-event',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        maxConcurrentRoutes: 4,
        timeout: 120000,
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

