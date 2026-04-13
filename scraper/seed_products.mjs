import fs from 'fs';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const results = [];
const CSV_FILE = 'scraper/Anekafoto_Products_Detailed.csv';
const TABLE_NAME = 'anekafoto_products';

console.log(`🚀 Starting data ingestion into ${TABLE_NAME}...`);

fs.createReadStream(CSV_FILE)
  .pipe(csv())
  .on('data', (data) => {
    // Clean and normalize price (Handle ranges by taking the first number)
    let cleanPrice = null;
    if (data.Price) {
      // Find the first sequence of digits (ignoring dots/commas as separators)
      const matches = data.Price.replace(/[.,]/g, '').match(/\d+/);
      if (matches) {
        cleanPrice = parseFloat(matches[0]);
      }
    }

    // Parse specifications
    let specs = {};
    try {
      specs = JSON.parse(data.Specifications || '{}');
    } catch (e) {
      specs = { raw: data.Specifications };
    }

    // Parse images
    let images = [];
    if (data.Images) {
      images = data.Images.split(',').map(img => img.trim()).filter(img => img.length > 0);
    }

    results.push({
      name: data.Name,
      brand: data.Brand === 'N/A' || !data.Brand ? null : data.Brand,
      price: isNaN(cleanPrice) ? null : cleanPrice,
      specifications: specs,
      description: data.Description,
      url: data.URL,
      images: images,
      scraped_at: data.ScrapedAt || new Date().toISOString()
    });
  })
  .on('end', async () => {
    console.log(`📊 Parsed ${results.length} products. Proceeding to upload...`);

    // Chunk size for bulk upsert
    const chunkSize = 100;
    for (let i = 0; i < results.length; i += chunkSize) {
      const chunk = results.slice(i, i + chunkSize);
      const { error } = await supabase
        .from(TABLE_NAME)
        .upsert(chunk, { onConflict: 'url' });

      if (error) {
        console.error(`❌ Error uploading chunk ${i}:`, error.message);
      } else {
        console.log(`✅ Uploaded products ${i + 1} to ${Math.min(i + chunkSize, results.length)}`);
      }
    }

    console.log('🏁 Ingestion complete!');
  });
