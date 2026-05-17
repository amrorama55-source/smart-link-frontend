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
    title: "Protect Your Commissions as an",
    gradientText: "Affiliate Marketer",
    subtitle: "Stop losing commissions to link hijackers. Cloak your affiliate links, track your real clicks, and optimize your funnels with advanced analytics.",
    badgeText: "For Affiliates",
    features: [
      {
        icon: Shield,
        title: "Link Cloaking & Protection",
        description: "Hide ugly affiliate parameters. Create clean, trustworthy links that users actually want to click, while protecting your commissions.",
        color: "red"
      },
      {
        icon: TrendingUp,
        title: "Real-Time Click Data",
        description: "Don't rely on delayed affiliate network reporting. See your clicks instantly and know exactly which traffic sources are performing.",
        color: "green"
      },
      {
        icon: Code,
        title: "Bot Filtering",
        description: "Clean your data automatically. Smart Link filters out bot traffic so you only analyze real human engagement and conversion rates.",
        color: "indigo"
      }
    ],
    heroVideo: "/marketing-demo.mp4",
    ctaText: "Start Tracking Links"
  }
};
