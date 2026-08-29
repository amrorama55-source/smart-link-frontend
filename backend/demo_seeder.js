const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Link = require('./models/Link');

// Load environment variables
dotenv.config();

const EMAIL = 'smartlinkpro10@gmail.com';
const SHORT_CODE = 'demo-link-advanced';

async function seedAdvancedDemoData() {
    try {
        console.log('🚀 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected.');

        // 1. Find User
        const user = await User.findOne({ email: EMAIL });
        if (!user) {
            console.error('❌ User not found:', EMAIL);
            process.exit(1);
        }
        console.log('👤 User found:', user.name, `(${user._id})`);

        // 2. Create or Find Link with Advanced Settings
        let link = await Link.findOne({ shortCode: SHORT_CODE });
        if (link) {
            console.log('🔗 Link found, resetting data...');
            await Link.deleteOne({ _id: link._id });
        }

        console.log('🔗 Creating Advanced Demo Link with Targeting & A/B Testing...');
        
        link = new Link({
            userId: user._id,
            shortCode: SHORT_CODE,
            originalUrl: 'https://www.by-smartlink.com/default-destination',
            title: 'Advanced Marketing Demo',
            description: 'Demo showing Targeting, A/B Testing, and Tracking',
            
            // ✅ Geotargeting Rules
            geoRules: [
                { countries: ['Saudi Arabia', 'United Arab Emirates', 'Kuwait'], targetUrl: 'https://www.by-smartlink.com/ar/promo', priority: 1 },
                { countries: ['United States', 'United Kingdom', 'Canada'], targetUrl: 'https://www.by-smartlink.com/en/special-offer', priority: 2 }
            ],

            // ✅ Device Targeting
            deviceRules: {
                mobile: 'https://www.by-smartlink.com/mobile-app-download',
                desktop: 'https://www.by-smartlink.com/desktop-portal'
            },

            // ✅ OS Level Targeting
            osRules: {
                ios: 'https://apps.apple.com/app/smart-link',
                android: 'https://play.google.com/store/apps/details?id=link.smart'
            },

            // ✅ A/B Testing Setup
            abTest: {
                enabled: true,
                status: 'running',
                splitMethod: 'weighted',
                variants: [
                    { name: 'Variant A (Blue Button)', url: 'https://www.by-smartlink.com/v1', weight: 50, clicks: 0, conversions: 0 },
                    { name: 'Variant B (Green Button)', url: 'https://www.by-smartlink.com/v2', weight: 50, clicks: 0, conversions: 0 }
                ],
                startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Started 7 days ago
            }
        });

        // 3. Generate 1200 realistic clicks
        console.log('📊 Generating 1200 advanced clicks...');
        const countries = ['United States', 'Saudi Arabia', 'Egypt', 'United Arab Emirates', 'United Kingdom', 'Germany', 'Canada', 'France', 'Jordan', 'Kuwait'];
        const devices = ['Mobile', 'Desktop', 'Tablet'];
        const oss = {
            'Mobile': ['iOS', 'Android'],
            'Desktop': ['Windows', 'macOS', 'Linux'],
            'Tablet': ['iOS', 'Android']
        };
        const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];

        const citiesMapping = {
            'United States': ['New York', 'Los Angeles', 'Chicago'],
            'Saudi Arabia': ['Riyadh', 'Jeddah', 'Dammam'],
            'Egypt': ['Cairo', 'Alexandria'],
            'United Arab Emirates': ['Dubai', 'Abu Dhabi'],
            'United Kingdom': ['London', 'Manchester']
        };

        const clicks = [];
        const visitorIds = [...Array(800)].map(() => Math.random().toString(36).substring(2, 15));

        for (let i = 0; i < 1200; i++) {
            const country = countries[Math.floor(Math.random() * countries.length)];
            const cityList = citiesMapping[country] || ['Unknown City'];
            const city = cityList[Math.floor(Math.random() * cityList.length)];
            
            const device = devices[Math.floor(Math.random() * devices.length)];
            const osList = oss[device] || ['Windows'];
            const os = osList[Math.floor(Math.random() * osList.length)];
            const browser = browsers[Math.floor(Math.random() * browsers.length)];
            const visitorId = visitorIds[Math.floor(Math.random() * visitorIds.length)];
            
            // Distributed timestamps over last 14 days
            const timestamp = new Date();
            timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 14));
            timestamp.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

            // A/B Test distribution
            const abVariantIndex = Math.random() > 0.5 ? 0 : 1; // 50/50 split
            const converted = abVariantIndex === 1 ? Math.random() > 0.7 : Math.random() > 0.85; // Variant B has better conversion (30% vs 15%)

            clicks.push({
                timestamp,
                visitorId,
                device,
                browser,
                os,
                country,
                city,
                ip: `192.168.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`,
                isMobile: device === 'Mobile' || device === 'Tablet',
                isNewVisitor: Math.random() > 0.4,
                abVariantIndex,
                abVariant: abVariantIndex === 0 ? 'Variant A (Blue Button)' : 'Variant B (Green Button)',
                converted,
                conversionValue: converted ? (Math.random() * 50 + 10).toFixed(2) : 0,
                conversionTime: converted ? new Date(timestamp.getTime() + (Math.random() * 600000)) : null
            });

            // Update Link stats for A/B variants
            link.abTest.variants[abVariantIndex].clicks += 1;
            if (converted) {
                link.abTest.variants[abVariantIndex].conversions += 1;
            }
        }

        // Calculate conversion rates for variants
        link.abTest.variants.forEach(v => {
            if (v.clicks > 0) {
                v.conversionRate = parseFloat(((v.conversions / v.clicks) * 100).toFixed(2));
            }
        });

        link.clicks = clicks;
        link.totalClicks = clicks.length;
        link.uniqueVisitors = new Set(clicks.map(c => c.visitorId)).size;
        link.returningVisitors = link.totalClicks - link.uniqueVisitors;
        link.lastClickedAt = new Date();

        await link.save();
        console.log('✅ Success! Advanced data seeded.');
        console.log('Short Code:', SHORT_CODE);
        console.log('Total Clicks:', link.totalClicks);
        console.log('Unique Visitors:', link.uniqueVisitors);
        console.log('A/B Test Variant A Clicks:', link.abTest.variants[0].clicks, `(CR: ${link.abTest.variants[0].conversionRate}%)`);
        console.log('A/B Test Variant B Clicks:', link.abTest.variants[1].clicks, `(CR: ${link.abTest.variants[1].conversionRate}%)`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedAdvancedDemoData();
