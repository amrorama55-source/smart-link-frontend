require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const AppSumoCode = require('../models/AppSumoCode');

const csvFilePath = 'C:\\Users\\Dell\\Desktop\\AppSumo_Codes.csv';

async function importCodes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const fileContent = fs.readFileSync(csvFilePath, 'utf8');
    const codes = fileContent.split('\n').map(c => c.trim()).filter(c => c.length > 0);

    console.log(`Found ${codes.length} codes in CSV.`);

    let inserted = 0;
    let skipped = 0;

    for (const code of codes) {
      try {
        const cleanCode = code.toUpperCase();
        const exists = await AppSumoCode.findOne({ code: cleanCode });
        if (!exists) {
          await AppSumoCode.create({ code: cleanCode });
          inserted++;
        } else {
          skipped++;
        }
      } catch (err) {
        console.error('Error inserting code:', code, err.message);
      }
    }

    console.log(`Import complete! Inserted: ${inserted}, Skipped (duplicates): ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importCodes();
