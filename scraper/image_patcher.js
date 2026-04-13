import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function patch() {
    console.log('🔍 Fetching products from Supabase...');
    const { data: products, error: fetchError } = await supabase
        .from('anekafoto_products')
        .select('id, url, name')
        .is('images', null); // Or check for empty array if needed, but let's re-patch all that don't have images

    // If check for empty array is needed: .or('images.eq.{},images.is.null')
    // For now let's just fetch ALL to be sure as per plan Recommendation.
    const { data: allProducts } = await supabase.from('anekafoto_products').select('id, url, name, images');
    
    // Filter locally to avoid complex Supabase queries for empty arrays
    const itemsToPatch = allProducts.filter(p => !p.images || p.images.length === 0);

    console.log(`📊 Found ${itemsToPatch.length} products needing image patches.`);

    if (itemsToPatch.length === 0) {
        console.log('✅ All products already have images. Exiting.');
        return;
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    let count = 0;
    const total = itemsToPatch.length;

    for (const product of itemsToPatch) {
        count++;
        console.log(`[${count}/${total}] Patching: ${product.name}`);
        
        try {
            await page.goto(product.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            
            // Wait a bit for swiper/lazy images
            await page.waitForTimeout(1000);

            // 1. Extract Images
            const imageUrls = await page.$$eval('img.pro_gallery_item', (imgs) => {
                return imgs
                    .map(img => img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy'))
                    .filter(src => src && (src.includes('.jpg') || src.includes('.png') || src.includes('.webp')));
            });

            // 2. Extract Specifications (Improved mapping)
            const specs = await page.$$eval('table.table-data-sheet tr, div.product-features dl dt, .data-sheet dt', (elements) => {
                const results = {};
                elements.forEach(el => {
                    const key = el.innerText.trim();
                    const valueEl = el.nextElementSibling;
                    if (valueEl) {
                        results[key] = valueEl.innerText.trim();
                    }
                });
                return results;
            });

            // Update Database
            const { error: updateError } = await supabase
                .from('anekafoto_products')
                .update({ 
                    images: imageUrls.length > 0 ? imageUrls : [],
                    specifications: Object.keys(specs).length > 0 ? specs : undefined,
                    updated_at: new Date().toISOString()
                })
                .eq('id', product.id);

            if (updateError) {
                console.error(`  ❌ Database error for ${product.id}:`, updateError.message);
            } else {
                console.log(`  ✅ Successfully patched ${imageUrls.length} images.`);
            }

        } catch (err) {
            console.error(`  ⚠️ Failed to scrape ${product.name}:`, err.message);
        }

        // Politely wait to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));
    }

    await browser.close();
    console.log('🎉 All tasks completed!');
}

patch().catch(console.error);
