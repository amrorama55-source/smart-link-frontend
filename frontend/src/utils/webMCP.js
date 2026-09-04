// src/utils/webMCP.js
// Official WebMCP Open Standard Implementation for Smart Link
// Enables AI Agents (ChatGPT In-App Browser & Chrome WebMCP) to interact natively with Smart Link

import { API_URL } from '../config';

/**
 * Register WebMCP tools on both document.modelContext and navigator.modelContext
 */
export function initWebMCP() {
  if (typeof window === 'undefined') return;

  // Initialize modelContext polyfill container if browser does not yet natively support it
  if (!document.modelContext) {
    document.modelContext = {
      tools: new Map(),
      registerTool: function (toolConfig) {
        if (!toolConfig || !toolConfig.name) return;
        this.tools.set(toolConfig.name, toolConfig);
        console.log('WebMCP Registered tool on document.modelContext:', toolConfig.name);
      },
      unregisterTool: function (name) {
        this.tools.delete(name);
      }
    };
  }

  if (window.navigator && !window.navigator.modelContext) {
    window.navigator.modelContext = document.modelContext;
  }

  // 1. Shorten URL Tool
  document.modelContext.registerTool({
    name: 'shorten_url',
    description: 'Shorten a long URL and create a bot-shielded Smart Link',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'The long destination URL to shorten' },
        customSlug: { type: 'string', description: 'Optional custom slug alias for the link' },
        title: { type: 'string', description: 'Optional title for the tracking campaign' }
      },
      required: ['url']
    },
    execute: async (input) => {
      try {
        const response = await fetch(API_URL + '/api/links/shorten', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            originalUrl: input.url,
            customSlug: input.customSlug,
            title: input.title || 'WebMCP Agent Link'
          })
        });
        const data = await response.json();
        if (data.shortUrl || data.link) {
          const shortUrl = data.shortUrl || ('https://www.by-smartlink.com/' + (data.link ? data.link.shortCode : ''));
          return {
            success: true,
            shortUrl: shortUrl,
            message: 'URL shortened and bot shield enabled.',
            raw: data
          };
        }
        return { success: false, error: data.error || 'Failed to shorten URL' };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
  });

  // 2. Analytics & Bot Shield Query Tool
  document.modelContext.registerTool({
    name: 'get_link_analytics',
    description: 'Get real-time click analytics and bot blocking statistics for a Smart Link',
    inputSchema: {
      type: 'object',
      properties: {
        shortCode: { type: 'string', description: 'The short code identifier of the link' }
      },
      required: ['shortCode']
    },
    execute: async (input) => {
      try {
        const response = await fetch(API_URL + '/api/links/' + input.shortCode + '/public-stats');
        const data = await response.json();
        return {
          success: true,
          totalClicks: data.totalClicks || 0,
          botClicksBlocked: data.botClicks || 0,
          humanClicks: (data.totalClicks || 0) - (data.botClicks || 0),
          countriesCount: data.countriesCount || 0,
          topCountries: data.topCountries || []
        };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
  });

  // 3. Ad-Fraud Savings Calculator Tool
  document.modelContext.registerTool({
    name: 'calculate_ad_savings',
    description: 'Calculate wasted ad spend saved from bot and datacenter traffic filtering',
    inputSchema: {
      type: 'object',
      properties: {
        monthlyAdSpend: { type: 'number', description: 'Monthly paid ad spend in USD' },
        botRate: { type: 'number', description: 'Estimated bot traffic percentage (default 0.34 for 34%)' }
      },
      required: ['monthlyAdSpend']
    },
    execute: async (input) => {
      const spend = Number(input.monthlyAdSpend) || 0;
      const rate = input.botRate !== undefined ? Number(input.botRate) : 0.34;
      const wasted = Math.round(spend * rate);
      return {
        monthlyAdSpend: spend,
        botRatePercentage: Math.round(rate * 100) + '%',
        monthlyWastedSpendSaved: wasted,
        annualWastedSpendSaved: wasted * 12,
        currency: 'USD'
      };
    }
  });

  // 4. Reputation & Bot Check Tool
  document.modelContext.registerTool({
    name: 'check_url_reputation',
    description: 'Analyze a URL for potential datacenter bot risks or affiliate redirection flags',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL to inspect' }
      },
      required: ['url']
    },
    execute: async (input) => {
      const isDatacenterDomain = /aws|digitalocean|cloud|azure|proxy|vpn/i.test(input.url);
      return {
        url: input.url,
        isSafe: !isDatacenterDomain,
        riskLevel: isDatacenterDomain ? 'HIGH_DATACENTER_PROXY' : 'LOW_HUMAN_CLEAN',
        recommendation: isDatacenterDomain ? 'Apply Smart Link Datacenter Shield before running paid campaigns' : 'Clean traffic expected'
      };
    }
  });

  // Dispatch WebMCP ready event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('webmcp:ready', { detail: { toolsCount: document.modelContext.tools.size } }));
    console.log('WebMCP Open Standard tools initialized, ready tools:', document.modelContext.tools.size);
  }
}
