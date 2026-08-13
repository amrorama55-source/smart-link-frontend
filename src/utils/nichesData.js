import { Layout, BarChart3, Target, Smartphone, Globe, Shield, Zap, TrendingUp, Code, Lock } from 'lucide-react';

export const nichesData = {
  creators: {
    title: "The Ultimate Bio Page for",
    gradientText: "Content Creators",
    subtitle: "Stop sending your followers to a dead end. Build a stunning, highly-converting bio page in minutes, track your clicks, and grow your audience effortlessly.",
    badgeText: "For Creators & Influencers",
    features: [
      {
        icon: Layout,
        title: "Beautiful Bio Pages",
        description: "Drag and drop to build your custom Link in Bio. Choose from premium themes and integrate your social feeds to keep followers engaged.",
        color: "purple"
      },
      {
        icon: BarChart3,
        title: "Deep Audience Insights",
        description: "Know exactly what your followers click. Track traffic sources, devices, and locations to understand your audience better.",
        color: "blue"
      },
      {
        icon: Target,
        title: "Sponsor Ready Tracking",
        description: "Generate professional analytics reports to show potential sponsors exactly how much value you can drive.",
        color: "green"
      }
    ],
    heroVideo: "/marketing-demo.mp4",
    ctaText: "Create Your Bio Page"
  },
  marketers: {
    title: "Advanced Link Management for",
    gradientText: "Growth Marketers",
    subtitle: "Maximize your campaign ROI. Use A/B testing, powerful tracking, and smart redirect rules to optimize every click and stop wasting ad spend.",
    badgeText: "For Growth Teams",
    features: [
      {
        icon: Zap,
        title: "A/B Testing & Optimization",
        description: "Split traffic between multiple landing pages automatically. Find out which variant converts best without touching any code.",
        color: "purple"
      },
      {
        icon: BarChart3,
        title: "Granular Campaign Tracking",
        description: "Add UTM parameters automatically. Track conversion rates, bounce rates, and user intent across all your marketing channels.",
        color: "blue"
      },
      {
        icon: Target,
        title: "Retargeting Pixels",
        description: "Fire your Facebook, Google, and TikTok pixels directly from your short links to build massive retargeting audiences.",
        color: "red"
      }
    ],
    heroVideo: "/marketing-demo.mp4",
    ctaText: "Optimize Your Campaigns"
  },
  ecommerce: {
    title: "Boost Sales & Conversions for",
    gradientText: "E-commerce Brands",
    subtitle: "Drive highly targeted traffic directly to your products. Smart Link increases your conversion rates by routing users to the right store based on their device and location.",
    badgeText: "For Online Stores",
    features: [
      {
        icon: Globe,
        title: "Geo-Targeted Routing",
        description: "Automatically redirect international shoppers to their local storefront (e.g., US users to .com, UK to .co.uk) with zero latency.",
        color: "orange"
      },
      {
        icon: Smartphone,
        title: "App Deep Linking",
        description: "Send iOS users straight to the App Store and Android users to Google Play. Remove friction and increase mobile sales.",
        color: "green"
      },
      {
        icon: Lock,
        title: "Custom Branded Domains",
        description: "Build trust with your customers. Use your own custom domain (e.g., shop.yourbrand.com) for all your promotional links.",
        color: "blue"
      }
    ],
    heroVideo: "/marketing-demo.mp4",
    ctaText: "Increase Your Sales"
  },
  affiliates: {
    title: "The Tracking Tool Built for",
    gradientText: "Affiliate Marketers",
    subtitle: "Ditch Voluum. Get geo-targeting, A/B testing, bot protection, and link cloaking — starting at $29/mo vs $89/mo. Your campaigns. Your data. Your profits.",
    badgeText: "For Affiliate Marketers",
    heroTag: "Trusted by 2,400+ affiliates worldwide",
    pain: [
      { emoji: "💸", text: "Paying $89+/mo for Voluum but only using 20% of features?" },
      { emoji: "🤖", text: "Bot traffic eating your ad budget and polluting your data?" },
      { emoji: "😤", text: "Affiliate networks delaying your click reports by hours?" },
      { emoji: "🔗", text: "Ugly affiliate URLs destroying your click-through rates?" },
    ],
    features: [
      {
        icon: 'Shield',
        title: "Auto-Shield Bot Protection",
        description: "Block VPN, datacenter, and botnet clicks automatically. Keep your conversion data 100% clean so you optimize on real human traffic only.",
        color: "red",
        stat: "34% avg bot rate blocked"
      },
      {
        icon: 'Globe',
        title: "Geo & Device Targeting",
        description: "Route US clicks to US offers, UK clicks to UK offers. Automatically. Set rules by country, city, device, OS, or language for maximum EPCs.",
        color: "blue",
        stat: "Country, City & ISP level"
      },
      {
        icon: 'TrendingUp',
        title: "Real-Time Click Intelligence",
        description: "See every click the moment it happens. No delayed network reports. Know which traffic sources convert before you've blown your budget.",
        color: "green",
        stat: "< 1 second latency"
      },
      {
        icon: 'Zap',
        title: "A/B Split Testing",
        description: "Send 50% to offer A, 50% to offer B. Let the data decide. Our engine tracks conversions and shows you the winner automatically.",
        color: "yellow",
        stat: "Unlimited variants"
      },
      {
        icon: 'Lock',
        title: "Link Cloaking & Protection",
        description: "Turn ugly ?aff_id=xyz123 URLs into clean yourname.com/go/offer links. Increase CTR by up to 35% and protect your commission source.",
        color: "purple",
        stat: "Up to 35% higher CTR"
      },
      {
        icon: 'Target',
        title: "Retargeting Pixels",
        description: "Fire your Facebook, Google, and TikTok pixels directly from your short links. Build massive warm audiences without touching your landing page code.",
        color: "orange",
        stat: "FB, Google, TikTok, Bing"
      },
    ],
    comparison: [
      { label: 'Price', smartlink: '$29/mo', voluum: '$89/mo', winner: 'smartlink' },
      { label: 'Bot Protection', smartlink: true, voluum: true, winner: 'smartlink' },
      { label: 'Link Cloaking', smartlink: true, voluum: false, winner: 'smartlink' },
      { label: 'Retargeting Pixels', smartlink: true, voluum: false, winner: 'smartlink' },
      { label: 'Bio Page Builder', smartlink: true, voluum: false, winner: 'smartlink' },
      { label: 'Geo Targeting', smartlink: true, voluum: true, winner: 'tie' },
      { label: 'A/B Testing', smartlink: true, voluum: true, winner: 'tie' },
    ],
    testimonials: [
      { name: 'Marcus T.', role: 'Media Buyer — ClickBank', avatar: 'MT', text: 'Switched from Voluum 3 months ago. Same features, $80/mo savings. The bot shield alone saved my conversion data from being completely trashed.' },
      { name: 'Sara K.', role: 'Affiliate @ MaxBounty', avatar: 'SK', text: 'The geo-targeting is insane. I set it up in 5 minutes to route traffic by country and my EPC jumped 40% overnight.' },
      { name: 'James R.', role: 'Solo Affiliate Marketer', avatar: 'JR', text: 'Real-time click data is a game changer. I killed a bad traffic source in 20 minutes instead of waiting for the network report.' },
    ],
    heroVideo: "/marketing-demo.mp4",
    ctaText: "Start Tracking Free",
    ctaSubtext: "No credit card required. 5 links free forever.",
  }
};
