const fs = require('fs');
const content = fs.readFileSync('frontend/src/utils/blogData.js', 'utf8');

// IDs we WANT to keep
const keepIds = [
  'curiosity-vs-intent-2026',
  'smart-link-vs-linktree-2026',
  'track-instagram-conversions-free',
  'smart-link-vs-beacons-2026',
  'bio-link-seo-guide-2026',
  'monetize-bio-link-2026',
  'smart-link-vs-bitly-arabic',
  'what-is-smart-link-ar',
  'what-is-smart-link-en',
  'free-saas-marketing-platforms-2026',
  'stop-losing-ad-budget-bot-clicks-2026'
];

// Use a proper parser approach: find each post by id marker
// We'll extract posts by finding "id: 'POST_ID'" and getting the surrounding object

function extractPostByIdFromContent(content, id) {
  const marker = `id: '${id}'`;
  const markerIndex = content.indexOf(marker);
  if (markerIndex === -1) {
    console.log(`NOT FOUND: ${id}`);
    return null;
  }
  
  // Find the { that opens this post (search backwards from marker)
  let openBrace = markerIndex;
  while (openBrace > 0 && content[openBrace] !== '{') {
    openBrace--;
  }
  
  // Now find the matching closing } by counting braces and template literals
  let depth = 0;
  let inTemplateLiteral = false;
  let i = openBrace;
  
  while (i < content.length) {
    const ch = content[i];
    
    // Handle template literals (backticks) - we need to skip over them
    if (ch === '`' && !inTemplateLiteral) {
      inTemplateLiteral = true;
      i++;
      // Skip until the closing backtick (handle \` escapes)
      while (i < content.length) {
        if (content[i] === '\\') {
          i += 2; // skip escaped char
          continue;
        }
        if (content[i] === '`') {
          inTemplateLiteral = false;
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    
    if (!inTemplateLiteral) {
      if (ch === '{') depth++;
      if (ch === '}') {
        depth--;
        if (depth === 0) {
          // Found the end of this post object
          return content.substring(openBrace, i + 1);
        }
      }
    }
    i++;
  }
  
  console.log(`COULD NOT FIND END for: ${id}`);
  return null;
}

const posts = [];
for (const id of keepIds) {
  const postContent = extractPostByIdFromContent(content, id);
  if (postContent) {
    posts.push(postContent);
    console.log(`✅ Extracted: ${id} (${postContent.length} chars)`);
  } else {
    console.log(`❌ Failed: ${id}`);
  }
}

const finalContent = `\nexport const BLOG_POSTS = [\n    ${posts.join(',\n    ')}\n];\n`;

fs.writeFileSync('frontend/src/utils/blogData.js', finalContent, 'utf8');
console.log(`\nDone! Total posts written: ${posts.length}`);
