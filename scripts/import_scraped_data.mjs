import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import csv from 'csv-parser';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CSV_FILE = 'scraper/Anekafoto_Products_Detailed.csv';

function parsePrice(priceStr) {
  if (!priceStr || priceStr === 'N/A') return 0;
  // Remove Rp, dots, commas, and non-numeric chars
  const cleanPrice = priceStr.replace(/[^\d]/g, '');
  return parseInt(cleanPrice, 10) || 0;
}

async function runImport() {
  console.log('🚀 Starting Data Migration...');

  // 1. Cleanup Dummy Data
  console.log('🧹 Cleaning up dummy data...');
  
  // Disable RLS might be needed if using service role, or just delete.
  // We delete leads first due to foreign keys if they exist
  await supabase.from('anekafoto_leads').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('anekafoto_customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('anekafoto_products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('✅ Temporary data cleared.');

  const results = [];

  fs.createReadStream(CSV_FILE)
    .pipe(csv())
    .on('data', (data) => {
      // Mapping based on CSV Header: Name,Brand,Price,Specifications,Description,URL,Images,ScrapedAt
      results.push({
        name: data.Name,
        brand: data.Brand === 'N/A' ? null : data.Brand,
        price: parsePrice(data.Price),
        specifications: JSON.parse(data.Specifications || '{}'),
        description: data.Description,
        url: data.URL,
        images: data.Images ? data.Images.split(',').map(img => img.trim()) : [],
        scraped_at: data.ScrapedAt || new Date().toISOString()
      });
    })
    .on('end', async () => {
      console.log(`📊 Parsed ${results.length} products. Starting upload...`);

      // Batch insert (chunks of 100 to avoid request size limits)
      const chunkSize = 100;
      for (let i = 0; i < results.length; i += chunkSize) {
        const chunk = results.slice(i, i + chunkSize);
        const { error } = await supabase.from('anekafoto_products').upsert(chunk, { onConflict: 'url' });
        
        if (error) {
          console.error(`❌ Error uploading chunk ${i / chunkSize}:`, error.message);
        } else {
          console.log(`✅ Uploaded chunk ${i / chunkSize + 1}/${Math.ceil(results.length / chunkSize)}`);
        }
      }

      console.log('🎉 Migration Complete!');
    });
}

runImport().catch(err => {
  console.error('💥 Fatal error during migration:', err);
});
