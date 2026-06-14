const fs = require('fs');
const sitemapPath = 'public/sitemap.xml';
let sitemap = fs.readFileSync(sitemapPath, 'utf8');

const blogDataPath = 'src/utils/blogData.js';
const blogDataContent = fs.readFileSync(blogDataPath, 'utf8');
const matches = blogDataContent.match(/id:\s*'([^']+)'/g).map(m => m.split("'")[1]);

let urls = '';
matches.forEach(id => {
  if (!sitemap.includes(id)) {
    urls += `  <url>\n    <loc>https://www.by-smartlink.com/blog/${id}</loc>\n    <lastmod>2026-06-14</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }
});

const newSitemap = sitemap.replace(/<!-- Pricing -->/, '<!-- Remaining Blog Posts -->\n' + urls + '\n  <!-- Pricing -->');
fs.writeFileSync(sitemapPath, newSitemap);
console.log('Sitemap updated with missing URLs');
