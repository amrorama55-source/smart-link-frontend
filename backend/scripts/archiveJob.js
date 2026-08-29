// backend/scripts/archiveJob.js
const mongoose = require('mongoose');
const Link = require('../models/Link');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartlink';

async function runArchiveJob() {
  try {
    console.log('🗄️ Starting Data Archiving Engine...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');

    // Find links that have more than 5000 clicks
    // Pre-filter using totalClicks for performance
    const links = await Link.find({ totalClicks: { $gt: 5000 } });
    
    console.log(`🔍 Found ${links.length} potential links to archive.`);
    let archivedCount = 0;

    for (const link of links) {
      if (link.clicks.length > 5000) {
        console.log(`📦 Archiving clicks for link: ${link.shortCode} (Current clicks array size: ${link.clicks.length})`);
        
        // The Link model has this method to push to ClickArchive
        await link.archiveOldClicks();
        
        // Truncate the active array to keep dashboard fast
        link.clicks = link.clicks.slice(-5000); 
        await link.save();
        
        archivedCount++;
      }
    }

    console.log(`✅ Archiving Job Completed. Archived data for ${archivedCount} links.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Archiving Job Failed:', error);
    process.exit(1);
  }
}

runArchiveJob();
