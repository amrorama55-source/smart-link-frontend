export const PLANS = [
    {
        id: 'free',
        name: 'Free Forever',
        price: {
            monthly: '$0',
            yearly: '$0'
        },
        checkoutUrl: {
            monthly: null,
            yearly: null
        },
        description: 'Perfect for getting started with your digital presence.',
        features: [
            '1,000 Smart Links / Mo',
            '1 Bio Page with Basic Themes',
            'Standard QR Codes',
            'Real-time Analytics',
            'Community Support'
        ],
        cta: 'Get Started Free',
        popular: false,
        color: 'blue'
    },
    {
        id: 'pro',
        name: 'Pro Creator',
        price: {
            monthly: '$9',
            yearly: '$7'
        },
        checkoutUrl: {
            monthly: 'https://smart-link-api.lemonsqueezy.com/checkout/buy/81853b68-7e82-4a8b-9887-be24dc2ba52e',
            yearly: 'https://smart-link-api.lemonsqueezy.com/checkout/buy/03310405-7910-4374-b6cf-244ef28a0586'
        },
        description: 'The best value for growing creators and startups.',
        features: [
            '10,000 Smart Links / Mo',
            'Unlimited Bio Pages',
            'Custom Domains',
            'A/B Testing & Split Traffic',
            'Password Protection',
            'Advanced Device Targeting',
            'Premium Bio Themes',
            'Priority Support'
        ],
        cta: 'Start 7-Day Free Trial',
        popular: true,
        color: 'indigo'
    },
    {
        id: 'business',
        name: 'Business Elite',
        price: {
            monthly: '$19',
            yearly: '$15'
        },
        checkoutUrl: {
            monthly: 'https://smart-link-api.lemonsqueezy.com/checkout/buy/205c1356-86cb-49f0-9e72-1926192c0fbe',
            yearly: 'https://smart-link-api.lemonsqueezy.com/checkout/buy/6ff8458f-1d64-443f-8e36-bc35c70b2a5c'
        },
        description: 'Advanced tools for agencies and large organizations.',
        features: [
            'Unlimited Smart Links',
            'Unlimited API Requests',
            'Advanced Custom Domains',
            'Custom Branded QR Codes',
            'Export Data (CSV)',
            'Detailed API Webhooks (Coming Soon)',
            'Team Collaboration (Coming Soon)',
            'Priority Support'
        ],
        cta: 'Upgrade to Business',
        popular: false,
        color: 'purple'
    }
];
