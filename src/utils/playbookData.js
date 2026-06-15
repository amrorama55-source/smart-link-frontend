// frontend/src/utils/playbookData.js
// Channel-Aware Onboarding System — Data & Helpers

export const CHANNELS = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    emoji: '📸',
    color: 'from-pink-500 to-purple-600',
    bgLight: 'bg-pink-50 dark:bg-pink-900/10',
    border: 'border-pink-200 dark:border-pink-800/40',
    text: 'text-pink-600 dark:text-pink-400',
    badge: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    description: 'Bio link, Stories & Reels',
    milestone: 10,
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    emoji: '✈️',
    color: 'from-sky-400 to-blue-600',
    bgLight: 'bg-sky-50 dark:bg-sky-900/10',
    border: 'border-sky-200 dark:border-sky-800/40',
    text: 'text-sky-600 dark:text-sky-400',
    badge: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
    description: 'Channels, Groups & Bots',
    milestone: 20,
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook Ads',
    emoji: '📘',
    color: 'from-blue-600 to-indigo-700',
    bgLight: 'bg-blue-50 dark:bg-blue-900/10',
    border: 'border-blue-200 dark:border-blue-800/40',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    description: 'Paid campaigns & audiences',
    milestone: 50,
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    emoji: '💬',
    color: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50 dark:bg-green-900/10',
    border: 'border-green-200 dark:border-green-800/40',
    text: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    description: 'Status, Groups & Broadcasts',
    milestone: 15,
  },
  email: {
    id: 'email',
    name: 'Email',
    emoji: '📧',
    color: 'from-orange-400 to-amber-600',
    bgLight: 'bg-orange-50 dark:bg-orange-900/10',
    border: 'border-orange-200 dark:border-orange-800/40',
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    description: 'Newsletters & campaigns',
    milestone: 30,
  },
  other: {
    id: 'other',
    name: 'Other',
    emoji: '🔗',
    color: 'from-gray-500 to-slate-600',
    bgLight: 'bg-gray-50 dark:bg-gray-800/40',
    border: 'border-gray-200 dark:border-gray-700',
    text: 'text-gray-600 dark:text-gray-400',
    badge: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    description: 'Blog, YouTube, TikTok, etc.',
    milestone: 10,
  },
};

export const PLAYBOOKS = {
  instagram: {
    title: 'Instagram Activation',
    subtitle: 'Get your first 10 clicks from Instagram',
    steps: [
      {
        id: 'copy',
        emoji: '📋',
        title: 'Copy your Smart Link',
        detail: 'Click the copy button on your link card above.',
      },
      {
        id: 'bio',
        emoji: '✏️',
        title: 'Paste in Instagram Bio',
        detail: 'Go to Instagram → Edit Profile → Website → Paste your link → Save.',
      },
      {
        id: 'story',
        emoji: '🎥',
        title: 'Create a Story with "Link in Bio"',
        detail: 'Post a Story and type "Link in bio ↓" to drive traffic.',
      },
      {
        id: 'return',
        emoji: '📊',
        title: 'Return after 10 clicks',
        detail: 'Come back here once you hit 10 clicks and see where they came from!',
      },
    ],
  },
  telegram: {
    title: 'Telegram Activation',
    subtitle: 'Get your first 20 clicks from Telegram',
    steps: [
      {
        id: 'copy',
        emoji: '📋',
        title: 'Copy your Smart Link',
        detail: 'Click the copy button on your link card above.',
      },
      {
        id: 'post',
        emoji: '📣',
        title: 'Send it in your channel or group',
        detail: 'Write a short message announcing the link to your audience.',
      },
      {
        id: 'pin',
        emoji: '📌',
        title: 'Pin the message',
        detail: 'Long-press the message → Pin it so it stays visible at the top.',
      },
      {
        id: 'return',
        emoji: '📊',
        title: 'Return after 20 clicks',
        detail: 'Come back and check the location & device breakdown of your audience!',
      },
    ],
  },
  facebook: {
    title: 'Facebook Ads Activation',
    subtitle: 'Get your first 50 clicks from your campaign',
    steps: [
      {
        id: 'copy',
        emoji: '📋',
        title: 'Copy your Smart Link',
        detail: 'Click the copy button on your link card above.',
      },
      {
        id: 'campaign',
        emoji: '🎯',
        title: 'Open Ads Manager',
        detail: 'Go to Facebook Business Suite → Ads Manager → Create Campaign.',
      },
      {
        id: 'paste',
        emoji: '🔗',
        title: 'Paste as destination URL',
        detail: 'In the Ad Set settings, paste your Smart Link as the "Website URL".',
      },
      {
        id: 'launch',
        emoji: '🚀',
        title: 'Launch & wait for first traffic',
        detail: 'After launch, check back here once clicks start rolling in!',
      },
    ],
  },
  whatsapp: {
    title: 'WhatsApp Activation',
    subtitle: 'Get your first 15 clicks from WhatsApp',
    steps: [
      {
        id: 'copy',
        emoji: '📋',
        title: 'Copy your Smart Link',
        detail: 'Click the copy button on your link card above.',
      },
      {
        id: 'status',
        emoji: '🟢',
        title: 'Post as WhatsApp Status',
        detail: 'Go to WhatsApp → Status → Text or link post with your Smart Link.',
      },
      {
        id: 'groups',
        emoji: '👥',
        title: 'Share in active groups',
        detail: 'Send to your most active groups with a short context message.',
      },
      {
        id: 'return',
        emoji: '📊',
        title: 'Return after 15 clicks',
        detail: 'Come back here and see which device type your audience uses!',
      },
    ],
  },
  email: {
    title: 'Email Campaign Activation',
    subtitle: 'Get your first 30 clicks from email',
    steps: [
      {
        id: 'copy',
        emoji: '📋',
        title: 'Copy your Smart Link',
        detail: 'Click the copy button on your link card above.',
      },
      {
        id: 'compose',
        emoji: '✍️',
        title: 'Add to your email body',
        detail: 'Paste your Smart Link as the CTA button or hyperlink in your email.',
      },
      {
        id: 'send',
        emoji: '📤',
        title: 'Send to your list',
        detail: 'Send your email campaign to your subscribers.',
      },
      {
        id: 'return',
        emoji: '📊',
        title: 'Return after 30 clicks',
        detail: 'Come back and check your email audience\'s locations & devices!',
      },
    ],
  },
  other: {
    title: 'Activation Playbook',
    subtitle: 'Get your first 10 clicks',
    steps: [
      {
        id: 'copy',
        emoji: '📋',
        title: 'Copy your Smart Link',
        detail: 'Click the copy button on your link card above.',
      },
      {
        id: 'share',
        emoji: '🌐',
        title: 'Share it where your audience is',
        detail: 'Post your Smart Link in your blog, YouTube description, or wherever your audience hangs out.',
      },
      {
        id: 'engage',
        emoji: '💡',
        title: 'Write a compelling call-to-action',
        detail: 'Tell people WHY they should click — a strong CTA doubles your click rate.',
      },
      {
        id: 'return',
        emoji: '📊',
        title: 'Return after 10 clicks',
        detail: 'Come back and explore your audience insights!',
      },
    ],
  },
};

// ─────────────────────────────────────────────
//  localStorage Helpers
// ─────────────────────────────────────────────

export const saveChannelForLink = (shortCode, channelId) => {
  try {
    localStorage.setItem(`sl_channel_${shortCode}`, channelId);
  } catch (_) {}
};

export const getChannelForLink = (shortCode) => {
  try {
    return localStorage.getItem(`sl_channel_${shortCode}`) || null;
  } catch (_) {
    return null;
  }
};

export const savePlaybookProgress = (shortCode, stepId, completed) => {
  try {
    const key = `sl_playbook_${shortCode}`;
    const current = JSON.parse(localStorage.getItem(key) || '{}');
    current[stepId] = completed;
    localStorage.setItem(key, JSON.stringify(current));
  } catch (_) {}
};

export const getPlaybookProgress = (shortCode) => {
  try {
    return JSON.parse(localStorage.getItem(`sl_playbook_${shortCode}`) || '{}');
  } catch (_) {
    return {};
  }
};

export const wasMilestoneNotified = (shortCode, milestone) => {
  try {
    return localStorage.getItem(`sl_ms_${shortCode}_${milestone}`) === 'true';
  } catch (_) {
    return false;
  }
};

export const saveMilestoneNotified = (shortCode, milestone) => {
  try {
    localStorage.setItem(`sl_ms_${shortCode}_${milestone}`, 'true');
  } catch (_) {}
};

export const MILESTONE_THRESHOLDS = [1, 10, 50, 100, 500, 1000];
