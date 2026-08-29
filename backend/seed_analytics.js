const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Link = require('./models/Link');

// Load environment variables
dotenv.config();

const EMAIL = 'smartlinkpro10@gmail.com';
const SHORT_CODE = 'marketing-demo';

async function seedData() {
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

        // 2. Create or Find Link
        let link = await Link.findOne({ shortCode: SHORT_CODE });
        if (link) {
            console.log('🔗 Link found, deleting existing clicks to reset...');
            link.clicks = [];
            link.totalClicks = 0;
            link.uniqueVisitors = 0;
            link.returningVisitors = 0;
        } else {
            console.log('🔗 Creating new Demo Link...');
            link = new Link({
                userId: user._id,
                shortCode: SHORT_CODE,
                originalUrl: 'https://www.by-smartlink.com',
                title: 'Marketing Demo Link',
                description: 'Used for recording the marketing video'
            });
        }

        // 3. Generate Dummy Clicks
        console.log('📊 Generating 650 realistic clicks...');
        const countries = ['United States', 'Saudi Arabia', 'Egypt', 'United Arab Emirates', 'United Kingdom', 'Germany', 'Canada', 'France', 'Jordan', 'Kuwait'];
        const devices = ['Mobile', 'Desktop', 'Tablet'];
        const oss = {
            'Mobile': ['iOS', 'Android'],
            'Desktop': ['Windows', 'macOS', 'Linux'],
            'Tablet': ['iOS', 'Android']
        };
        const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];

        const citiesMapping = {
            'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
            'Saudi Arabia': ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'],
            'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Sharm El Sheikh', 'Luxor'],
            'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
            'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow'],
            'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'],
            'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
            'France': ['Paris', 'Lyon', 'Marseille', 'Nice'],
            'Jordan': ['Amman', 'Zarqa', 'Irbid'],
            'Kuwait': ['Kuwait City', 'Jahra', 'Salmiya']
        };

        const clicks = [];
        const visitorIds = [...Array(400)].map(() => Math.random().toString(36).substring(2, 15));

        for (let i = 0; i < 650; i++) {
            const country = countries[Math.floor(Math.random() * countries.length)];
            const cityList = citiesMapping[country] || ['Unknown City'];
            const city = cityList[Math.floor(Math.random() * cityList.length)];
            
            const device = devices[Math.floor(Math.random() * devices.length)];
            const osList = oss[device];
            const os = osList[Math.floor(Math.random() * osList.length)];
            const browser = browsers[Math.floor(Math.random() * browsers.length)];
            const visitorId = visitorIds[Math.floor(Math.random() * visitorIds.length)];
            
            // Random date in the last 30 days
            const timestamp = new Date();
            timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
            timestamp.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

            clicks.push({
                timestamp,
                visitorId,
                device,
                browser,
                os,
                country,
                city,
                ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
                isMobile: device === 'Mobile' || device === 'Tablet',
                isNewVisitor: Math.random() > 0.3,
                converted: Math.random() > 0.85 // 15% conversion rate
            });
        }

        link.clicks = clicks;
        link.totalClicks = clicks.length;
        link.uniqueVisitors = new Set(clicks.map(c => c.visitorId)).size;
        link.returningVisitors = link.totalClicks - link.uniqueVisitors;
        link.lastClickedAt = new Date();

        await link.save();
        console.log('✅ Success! 650 clicks seeded to link:', link.shortCode);
        console.log('👉 Dashboard URL should be showing this data now.');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedData();
