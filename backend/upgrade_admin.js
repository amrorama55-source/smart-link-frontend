require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

const upgradeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const User = require('./backend/models/User');
        const result = await User.updateOne(
            { email: 'amrorama55@gmail.com' },
            { 
                $set: { 
                    plan: 'enterprise', // Upgrade to the highest tier
                } 
            }
        );

        console.log('✅ Successfully upgraded user to enterprise tier:', result);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

upgradeAdmin();
