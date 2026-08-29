/**
 * 🛡️ URL Safety Scanner
 * 
 * Checks URLs against known phishing patterns, suspicious domains,
 * and brand impersonation attempts before allowing link creation.
 */
const axios = require('axios');

// ==========================================
// 🚫 BLOCKED DOMAINS - Known phishing/malware
// ==========================================
const BLOCKED_DOMAINS = [
  // Known phishing infrastructure (from our reports)
  'smmall.cloud',
  'museetmidtnorge.smmall.cloud',
  
  // Common free hosting used for phishing
  '000webhostapp.com',
  'weebly.com/phishing',
  'blogspot.com',
  'sites.google.com',
  
  // Add more as you discover them
];

// ==========================================
// 🚫 SUSPICIOUS KEYWORDS in URLs
// ==========================================
const PHISHING_KEYWORDS = [
  // Microsoft impersonation
  'onedrive-sharepoint',
  'sharepoint-onedrive', 
  'microsoft-login',
  'microsoft-signin',
  'office365-login',
  'outlook-signin',
  'microsoft-verify',
  'microsoft-security',
  'microsoft-account-verify',
  'ms-login',
  'ms-signin',
  
  // Google impersonation
  'google-signin',
  'google-verify',
  'gmail-login',
  'google-security',
  'google-account-verify',
  
  // Apple impersonation
  'apple-id-verify',
  'icloud-login',
  'apple-signin',
  'apple-security',
  
  // Banking/Financial
  'bank-verify',
  'paypal-verify',
  'paypal-login',
  'account-suspended',
  'verify-your-account',
  'update-billing',
  'confirm-identity',
  
  // Generic phishing patterns
  'login-verify',
  'account-verify',
  'security-alert',
  'security-update',
  'password-reset-verify',
  'urgent-action',
  'suspended-account',
];

// ==========================================
// 🚫 BRAND DOMAINS that should NOT be link targets
// (legitimate brands don't need short links from us)
// ==========================================
const IMPERSONATION_PATTERNS = [
  // These regex patterns detect fake brand pages
  // (NOT the real domains, but lookalikes)
  /m[i1l]crosoft/i,         // microsoft misspellings
  /paypa[l1]/i,             // paypal misspellings  
  /app[l1]e.*id/i,          // apple id fakes
  /netf[l1]ix.*login/i,     // netflix login fakes
  /faceb[o0]{2}k/i,         // facebook misspellings
  /amaz[o0]n.*signin/i,     // amazon signin fakes
  /micr0soft/i,
  /outl[o0]{2}k/i,
  /g[o0]{2}gle.*login/i,
];

const SUSPICIOUS_TLDS = [
  '.zip', '.mov', '.click', '.top', '.xyz', '.gq', '.tk', '.ml', '.cf'
];

/**
 * Check if a URL is safe to create a short link for.
 * 
 * @param {string} url - The URL to check
 * @returns {{ safe: boolean, reason: string|null }} 
 */
async function checkUrlSafety(url) {
  if (!url) return { safe: true, reason: null };

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const fullUrl = url.toLowerCase();

    // --- Check 0: Protocol allowlist ---
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        safe: false,
        reason: 'Only HTTP and HTTPS URLs are allowed.'
      };
    }

    // --- Check 0.1: IDN/Punycode + credential abuse checks ---
    if (hostname.startsWith('xn--') || hostname.includes('.xn--')) {
      return {
        safe: false,
        reason: 'Internationalized/punycode domains are not allowed for security reasons.'
      };
    }
    if (urlObj.username || urlObj.password) {
      return {
        safe: false,
        reason: 'URLs containing embedded credentials are blocked.'
      };
    }
    if (SUSPICIOUS_TLDS.some((tld) => hostname.endsWith(tld))) {
      return {
        safe: false,
        reason: 'This top-level domain is currently blocked due to high abuse rates.'
      };
    }

    // --- Check 1: Blocked domains ---
    for (const domain of BLOCKED_DOMAINS) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        return {
          safe: false,
          reason: `This URL's domain (${hostname}) has been blocked due to abuse reports. If you believe this is an error, please contact support.`
        };
      }
    }

    // --- Check 2: Phishing keywords in URL path ---
    const urlPath = (urlObj.pathname + urlObj.search).toLowerCase();
    for (const keyword of PHISHING_KEYWORDS) {
      if (urlPath.includes(keyword) || hostname.includes(keyword)) {
        return {
          safe: false,
          reason: `This URL contains suspicious patterns commonly associated with phishing. If this is a legitimate URL, please contact support.`
        };
      }
    }

    // --- Check 3: Brand impersonation in hostname ---
    for (const pattern of IMPERSONATION_PATTERNS) {
      // Only flag if it's NOT the real domain
      const realDomains = [
        'microsoft.com', 'live.com', 'outlook.com', 'office.com',
        'paypal.com', 'apple.com', 'icloud.com',
        'netflix.com', 'facebook.com', 'meta.com',
        'amazon.com', 'aws.amazon.com'
      ];
      
      const isRealDomain = realDomains.some(real => 
        hostname === real || hostname.endsWith('.' + real)
      );

      if (!isRealDomain && pattern.test(hostname)) {
        return {
          safe: false,
          reason: `This URL appears to impersonate a well-known brand. Creating links to impersonation sites is not allowed.`
        };
      }
    }

    // --- Check 4: Data URLs / JavaScript URLs ---
    // --- Check 5: IP address URLs (often phishing) ---
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipRegex.test(hostname)) {
      return {
        safe: false,
        reason: `URLs using IP addresses directly are not allowed. Please use a domain name.`
      };
    }

    // --- Check 6: Google Safe Browsing API ---
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    if (apiKey) {
      try {
        const response = await axios.post(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`, {
          client: {
            clientId: "smart-link-url-shortener",
            clientVersion: "1.0.0"
          },
          threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
          }
        });

        if (response.data && response.data.matches && response.data.matches.length > 0) {
          const match = response.data.matches[0];
          return {
            safe: false,
            reason: `This URL has been flagged by Google Safe Browsing as unsafe (${match.threatType}).`
          };
        }
      } catch (googleError) {
        console.error('⚠️ Google Safe Browsing API Error:', googleError.message);
        // We don't block the link if Google's API fails, we just rely on static checks
      }
    }

    return { safe: true, reason: null };

  } catch (error) {
    // If URL parsing fails, let the existing validation catch it
    return { safe: true, reason: null };
  }
}

/**
 * Add a domain to the blocklist at runtime
 * (for immediate response to abuse reports)
 */
function blockDomain(domain) {
  const normalized = domain.toLowerCase().trim();
  if (!BLOCKED_DOMAINS.includes(normalized)) {
    BLOCKED_DOMAINS.push(normalized);
    console.log('🚫 Domain added to blocklist:', normalized);
  }
}

module.exports = {
  checkUrlSafety,
  blockDomain,
  BLOCKED_DOMAINS
};
