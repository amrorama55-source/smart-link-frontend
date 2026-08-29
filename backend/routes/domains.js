// routes/domains.js - NEW: Custom Domain Management
const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const { verifyToken } = require('../middleware/verifyToken');
const dns = require('dns').promises;
router.post('/:shortCode/domain/verify-request', verifyToken, async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    console.log('🌐 Domain verification request for:', domain);

    // Check plan eligibility - block free users AND users with expired trials
    const trialExpired = req.user.plan === 'trial' &&
      req.user.trialEndsAt && new Date() > new Date(req.user.trialEndsAt);

    if (req.user.plan === 'free' || trialExpired) {
      return res.status(403).json({
        error: 'Premium feature restricted',
        message: trialExpired
          ? 'Your trial has ended. Upgrade to a paid plan to use custom domains.'
          : 'Custom domains are only available on Pro and Business plans. Start your 7-day trial to try it now!'
      });
    }

    // Validate domain format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(domain)) {
      return res.status(400).json({
        error: 'Invalid domain format',
        message: 'Please provide a valid domain (e.g., links.example.com)'
      });
    }

    // Find link
    const link = await Link.findOne({
      shortCode,
      userId: req.user._id
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Check if domain is already in use by another user
    const existingDomain = await Link.findOne({
      customDomain: domain.toLowerCase(),
      userId: { $ne: req.user._id }
    });

    if (existingDomain) {
      return res.status(409).json({
        error: 'Domain already in use',
        message: 'This domain is already being used by another user'
      });
    }

    // Generate verification token
    const verificationToken = link.generateDomainVerificationToken();
    link.customDomain = domain.toLowerCase();

    await link.save();

    // Track Activation Progress: Create Custom Domain
    if (req.userDoc && !req.userDoc.activationChecklist?.createCustomDomain?.completed) {
      if (!req.userDoc.activationChecklist) req.userDoc.activationChecklist = {};
      req.userDoc.activationChecklist.createCustomDomain = {
        completed: true,
        completedAt: new Date()
      };
      await req.userDoc.save();
    }

    console.log('✅ Verification token generated:', verificationToken);

    res.json({
      success: true,
      message: 'Verification token generated',
      domain: domain.toLowerCase(),
      verification: {
        token: verificationToken,
        methods: [
          {
            type: 'DNS',
            instructions: {
              recordType: 'TXT',
              host: `_verification.${domain}`,
              value: verificationToken,
              description: 'Add this TXT record to your DNS settings'
            }
          },
          {
            type: 'CNAME',
            instructions: {
              recordType: 'CNAME',
              host: domain,
              value: process.env.BASE_DOMAIN || 'by-smartlink.com',
              description: 'Point your domain to our service (required for redirects to work)'
            }
          }
        ]
      },
      nextStep: 'Add the DNS records above, then call /verify-check to verify'
    });

  } catch (error) {
    console.error('❌ Domain verification request error:', error);
    res.status(500).json({
      error: 'Failed to initiate domain verification',
      message: error.message
    });
  }
});
router.post('/:shortCode/domain/verify-check', verifyToken, async (req, res) => {
  try {
    const { shortCode } = req.params;

    console.log('🔍 Checking domain verification for:', shortCode);

    const link = await Link.findOne({
      shortCode,
      userId: req.user._id
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    if (!link.customDomain || !link.domainVerification?.verificationToken) {
      return res.status(400).json({
        error: 'No domain verification pending',
        message: 'Please request verification first'
      });
    }

    const domain = link.customDomain;
    const token = link.domainVerification.verificationToken;

    console.log('🔍 Checking DNS records for:', domain);
    console.log('🔍 Expected token:', token);

    // Check DNS TXT record
    let txtRecordFound = false;
    try {
      const txtRecords = await dns.resolveTxt(`_verification.${domain}`);
      console.log('📋 TXT Records found:', txtRecords);

      txtRecordFound = txtRecords.some(record =>
        record.join('').includes(token)
      );

      console.log('✅ TXT Record match:', txtRecordFound);
    } catch (error) {
      console.log('❌ TXT Record lookup failed:', error.message);
    }

    // Check CNAME record
    let cnameCorrect = false;
    try {
      const cnameRecords = await dns.resolveCname(domain);
      console.log('📋 CNAME Records:', cnameRecords);

      const expectedCname = (process.env.BASE_DOMAIN || 'smart-link.website').toLowerCase();
      cnameCorrect = cnameRecords.some(record =>
        record.toLowerCase().includes(expectedCname)
      );

      console.log('✅ CNAME correct:', cnameCorrect);
    } catch (error) {
      console.log('⚠️ CNAME Record lookup failed:', error.message);
      // CNAME is optional for verification, but required for functionality
    }

    // Verify domain
    if (txtRecordFound) {
      link.domainVerification.isVerified = true;
      link.domainVerification.verifiedAt = new Date();
      link.domainVerification.verificationMethod = 'DNS';

      await link.save();
      return res.json({
        success: true,
        message: 'Domain verified successfully!',
        verification: {
          domain,
          verified: true,
          verifiedAt: link.domainVerification.verifiedAt,
          method: 'DNS',
          txtRecord: txtRecordFound,
          cnameRecord: cnameCorrect,
          warning: !cnameCorrect ? 'CNAME record not found. Redirects may not work until you add it.' : null
        },
        nextSteps: !cnameCorrect ? [
          'Add CNAME record to make redirects work',
          `CNAME: ${domain} → ${process.env.BASE_DOMAIN || 'smart-link.website'}`
        ] : []
      });
    }

    // Not verified yet
    res.json({
      success: false,
      message: 'Domain verification pending',
      verification: {
        domain,
        verified: false,
        txtRecord: txtRecordFound,
        cnameRecord: cnameCorrect,
        issues: [
          !txtRecordFound && 'TXT record not found or incorrect',
          !cnameCorrect && 'CNAME record not found (optional for verification, required for functionality)'
        ].filter(Boolean)
      },
      help: {
        txtRecord: !txtRecordFound ? {
          type: 'TXT',
          host: `_verification.${domain}`,
          value: token,
          checkCommand: `dig TXT _verification.${domain}`
        } : null,
        cnameRecord: !cnameCorrect ? {
          type: 'CNAME',
          host: domain,
          value: process.env.BASE_DOMAIN || 'by-smartlink.com',
          checkCommand: `dig CNAME ${domain}`
        } : null
      }
    });

  } catch (error) {
    console.error('❌ Domain verification check error:', error);
    res.status(500).json({
      error: 'Failed to verify domain',
      message: error.message
    });
  }
});
router.delete('/:shortCode/domain', verifyToken, async (req, res) => {
  try {
    const { shortCode } = req.params;

    const link = await Link.findOne({
      shortCode,
      userId: req.user._id
    });

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const removedDomain = link.customDomain;

    link.customDomain = undefined;
    link.domainVerification = {
      isVerified: false,
      verificationToken: undefined,
      verificationMethod: undefined,
      verifiedAt: undefined
    };

    await link.save();

    console.log('✅ Domain removed:', removedDomain);

    res.json({
      success: true,
      message: 'Custom domain removed',
      removedDomain
    });

  } catch (error) {
    console.error('❌ Remove domain error:', error);
    res.status(500).json({
      error: 'Failed to remove domain',
      message: error.message
    });
  }
});
router.get('/user/domains', verifyToken, async (req, res) => {
  try {
    const links = await Link.find({
      userId: req.user._id,
      customDomain: { $exists: true, $ne: null }
    }).select('shortCode customDomain domainVerification title createdAt');

    const domains = links.map(link => ({
      shortCode: link.shortCode,
      title: link.title || 'Untitled',
      domain: link.customDomain,
      verified: link.domainVerification?.isVerified || false,
      verifiedAt: link.domainVerification?.verifiedAt,
      fullUrl: link.domainVerification?.isVerified
        ? `https://${link.customDomain}/${link.shortCode}`
        : null,
      createdAt: link.createdAt
    }));

    res.json({
      success: true,
      domains,
      total: domains.length,
      verified: domains.filter(d => d.verified).length,
      pending: domains.filter(d => !d.verified).length
    });

  } catch (error) {
    console.error('❌ Get domains error:', error);
    res.status(500).json({
      error: 'Failed to fetch domains',
      message: error.message
    });
  }
});
router.post('/check-availability', verifyToken, async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    // Validate format
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(domain)) {
      return res.status(400).json({
        available: false,
        error: 'Invalid domain format'
      });
    }

    // Check if in use
    const existingLink = await Link.findOne({
      customDomain: domain.toLowerCase()
    });

    if (existingLink) {
      // Check if it's the current user's domain
      if (existingLink.userId.toString() === req.user._id.toString()) {
        return res.json({
          available: true,
          message: 'This is your domain',
          ownedByYou: true
        });
      }

      return res.json({
        available: false,
        message: 'Domain is already in use'
      });
    }

    res.json({
      available: true,
      message: 'Domain is available'
    });

  } catch (error) {
    console.error('❌ Check availability error:', error);
    res.status(500).json({
      error: 'Failed to check domain availability',
      message: error.message
    });
  }
});
router.get('/:shortCode/domain/ssl-status', verifyToken, async (req, res) => {
  try {
    const { shortCode } = req.params;

    const link = await Link.findOne({
      shortCode,
      userId: req.user._id
    });

    if (!link || !link.customDomain) {
      return res.status(404).json({ error: 'Link or domain not found' });
    }

    const domain = link.customDomain;
    const https = require('https');

    // Check SSL certificate
    try {
      await new Promise((resolve, reject) => {
        const options = {
          host: domain,
          port: 443,
          method: 'GET',
          rejectUnauthorized: false
        };

        const req = https.request(options, (res) => {
          const cert = res.socket.getPeerCertificate();

          if (res.socket.authorized) {
            resolve({
              valid: true,
              issuer: cert.issuer,
              validFrom: cert.valid_from,
              validTo: cert.valid_to,
              daysRemaining: Math.floor((new Date(cert.valid_to) - new Date()) / (1000 * 60 * 60 * 24))
            });
          } else {
            reject(new Error('Certificate not authorized'));
          }
        });

        req.on('error', reject);
        req.end();
      });

      // Update link
      link.domainVerification.sslEnabled = true;
      link.domainVerification.sslIssuedAt = new Date();
      await link.save();

      res.json({
        success: true,
        ssl: {
          enabled: true,
          valid: true,
          checkedAt: new Date()
        }
      });

    } catch (error) {
      console.log('⚠️ SSL check failed:', error.message);

      res.json({
        success: true,
        ssl: {
          enabled: false,
          valid: false,
          error: error.message,
          checkedAt: new Date(),
          help: 'SSL certificates can take up to 24 hours to issue. Please check back later.'
        }
      });
    }

  } catch (error) {
    console.error('❌ SSL status error:', error);
    res.status(500).json({
      error: 'Failed to check SSL status',
      message: error.message
    });
  }
});
router.get('/setup-guide', (req, res) => {
  res.json({
    success: true,
    guide: {
      title: 'Custom Domain Setup Guide',
      steps: [
        {
          step: 1,
          title: 'Add Your Domain',
          description: 'Request verification for your domain through the API or dashboard',
          endpoint: 'POST /:shortCode/domain/verify-request',
          example: {
            domain: 'links.example.com'
          }
        },
        {
          step: 2,
          title: 'Add DNS Records',
          description: 'Add these records to your domain\'s DNS settings',
          records: [
            {
              type: 'TXT',
              name: '_verification.links.example.com',
              value: 'Your verification token',
              purpose: 'Domain ownership verification'
            },
            {
              type: 'CNAME',
              name: 'links.example.com',
              value: process.env.BASE_DOMAIN || 'by-smartlink.com',
              purpose: 'Point your domain to our servers'
            }
          ],
          note: 'DNS changes can take up to 48 hours to propagate'
        },
        {
          step: 3,
          title: 'Verify Domain',
          description: 'Check if your domain is verified',
          endpoint: 'POST /:shortCode/domain/verify-check',
          waitTime: '5-10 minutes after adding DNS records'
        },
        {
          step: 4,
          title: 'SSL Certificate',
          description: 'SSL certificates are issued automatically',
          endpoint: 'GET /:shortCode/domain/ssl-status',
          waitTime: 'Up to 24 hours for SSL issuance'
        },
        {
          step: 5,
          title: 'Start Using',
          description: 'Your custom domain is ready!',
          example: 'https://links.example.com/abc123'
        }
      ],
      commonIssues: [
        {
          issue: 'DNS records not found',
          solution: 'Wait 5-10 minutes after adding records, then try verification again'
        },
        {
          issue: 'Verification fails',
          solution: 'Double-check the TXT record value matches exactly (copy-paste recommended)'
        },
        {
          issue: 'SSL certificate not working',
          solution: 'SSL can take up to 24 hours. Ensure CNAME record is correct.'
        },
        {
          issue: 'Domain already in use',
          solution: 'This domain is being used by another user. Try a different subdomain.'
        }
      ],
      dnsProviders: {
        cloudflare: 'Add records in DNS → Records section',
        namecheap: 'Add records in Advanced DNS tab',
        godaddy: 'Add records in DNS Management',
        googleDomains: 'Add records in DNS settings',
        route53: 'Add records in Hosted Zone'
      }
    }
  });
});
router.get('/verify', verifyToken, async (req, res) => {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: 'Domain query parameter is required' });
  }

  const cleanedDomain = domain.trim().toLowerCase();

  try {
    // The CNAME target we expect
    const expectedTarget = (process.env.BASE_URL || 'https://api.by-smartlink.com')
      .replace(/^https?:\/\//i, '')
      .replace(/\/.*$/, '');

    let cnames = [];
    try {
      cnames = await dns.resolveCname(cleanedDomain);
    } catch {
      // Domain might not have CNAME yet
      return res.json({
        verified: false,
        domain: cleanedDomain,
        message: `No CNAME record found for ${cleanedDomain}. Please add a CNAME pointing to ${expectedTarget}.`
      });
    }

    const isVerified = cnames.some(c =>
      c.toLowerCase().includes(expectedTarget) ||
      c.toLowerCase().endsWith('fly.dev') ||
      c.toLowerCase().endsWith('railway.app')
    );

    if (isVerified) {
      return res.json({
        verified: true,
        domain: cleanedDomain,
        cname: cnames[0],
        message: 'Domain DNS is configured correctly!'
      });
    } else {
      return res.json({
        verified: false,
        domain: cleanedDomain,
        cname: cnames[0],
        message: `CNAME found but points to "${cnames[0]}" instead of "${expectedTarget}". Please update your DNS.`
      });
    }
  } catch (err) {
    console.error('Domain verify error:', err);
    res.status(500).json({ error: 'Failed to verify domain. Please try again.' });
  }
});

module.exports = router;