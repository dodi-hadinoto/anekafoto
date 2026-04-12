import { PlaywrightCrawler, Dataset, log } from 'crawlee';

// Crawler untuk shop.anekafoto.com - Versi Full Catalog Extraction
const crawler = new PlaywrightCrawler({
    launchContext: {
        launchOptions: {
            headless: true,
        },
    },
    // Pengaturan performa & anti-deteksi
    maxConcurrency: 5,
    requestHandlerTimeoutSecs: 120,
    
    async requestHandler({ request, page, enqueueLinks, log }) {
        const { label } = request.userData;

        // --- HANDLER HALAMAN LIST (Home / Categories / Brands) ---
        if (label === 'LIST' || !label) {
            log.info(`Processing list page: ${request.url}`);
            
            // 1. Tangani Infinite Scroll / 'Load More' secara berulang
            let hasMore = true;
            let maxScrolls = 50; 
            while (hasMore && maxScrolls > 0) {
                const moreButton = await page.$('a.p-scroll-more');
                if (moreButton && await moreButton.isVisible()) {
                    await moreButton.click();
                    await page.waitForTimeout(1500); 
                    maxScrolls--;
                } else {
                    hasMore = false;
                }
            }

            // 2. Enqueue produk
            await enqueueLinks({
                selector: 'a.product_img_link, .s_title_block a, a.product-name, .product-container a',
                userData: { label: 'DETAIL' },
                transformRequestFunction: (req) => {
                    if (
                        req.url.includes('/cart') || 
                        req.url.includes('/login') || 
                        req.url.includes('contact-us') ||
                        req.url.includes('/blog/') ||
                        req.url.includes('content/')
                    ) return false;
                    return req;
                }
            });

            // 3. Enqueue Kategori & Brand Lainnya
            if (!label) {
                await enqueueLinks({
                    selector: 'a[href*="/brand/"], a[href*="/category/"], .category-sub-menu a, a.dropdown-item',
                    userData: { label: 'LIST' },
                });
            }
        } 
        
        // --- HANDLER HALAMAN DETAIL PRODUK ---
        else if (label === 'DETAIL') {
            log.info(`Extracting product: ${request.url}`);
            
            const name = await page.$eval('h1, .h1, .page-title', (el) => el.innerText.trim()).catch(() => 'N/A');
            const rawPrice = await page.$eval('.current-price span, .product-price, [itemprop="price"]', (el) => el.innerText.trim()).catch(() => 'N/A');
            
            // FILTER: Hanya ambil yang memiliki harga valid (menunjukkan sedang dijual)
            if (rawPrice === 'N/A' || rawPrice === '' || !/\d/.test(rawPrice)) {
                log.warning(`Skipping product (No valid price found): ${name} | ${request.url}`);
                return;
            }
            const price = rawPrice;

            // Selector brand yang lebih kuat
            const brand = await page.$eval('.product-manufacturer img', (el) => el.alt).catch(() => 
                page.$eval('.product-manufacturer a', (el) => el.innerText.trim()).catch(() => 
                    page.$eval('meta[property="product:brand"]', (el) => el.content).catch(() => 'N/A')
                )
            );
            
            // Ekstrak Deskripsi (Ambil teks yang lebih bersih untuk membantu customer)
            const description = await page.$eval('#description, .product-description, [itemprop="description"]', (el) => el.innerText.trim()).catch(() => '');
            
            // Ekstrak Spesifikasi / Data Sheet
            let features = await page.$$eval('dl.data-sheet dt.name, dl.data-sheet dd.value', (els) => {
                const data = {};
                for (let i = 0; i < els.length; i += 2) {
                    if (els[i+1]) {
                        const key = els[i].innerText.replace(':', '').trim();
                        const val = els[i+1].innerText.trim();
                        data[key] = val;
                    }
                }
                return data;
            }).catch(() => ({}));

            // OPTIMASI: Ekstrak "Key Features" dan list lainnya dari deskripsi
            if (Object.keys(features).length === 0) {
                features = await page.$$eval('.product-description h1, .product-description h2, .product-description h3, .product-description b, .product-description strong, .product-description ul', (els) => {
                    const extracted = {};
                    let currentSection = 'General Features';
                    
                    els.forEach(el => {
                        const tagName = el.tagName.toLowerCase();
                        if (['h1', 'h2', 'h3', 'b', 'strong'].includes(tagName)) {
                            const text = el.innerText.trim();
                            if (text.length > 3 && text.length < 50) {
                                currentSection = text;
                            }
                        } else if (tagName === 'ul') {
                            const items = Array.from(el.querySelectorAll('li')).map(li => li.innerText.trim()).filter(t => t.length > 0);
                            if (items.length > 0) {
                                extracted[currentSection] = (extracted[currentSection] ? extracted[currentSection] + ' | ' : '') + items.join(' | ');
                            }
                        }
                    });
                    return extracted;
                }).catch(() => ({}));
            }

            // Fallback Spesifikasi dari Deskripsi secara cerdas (Text-based)
            if (Object.keys(features).length === 0 && description) {
                const lines = description.split('\n').map(l => l.trim()).filter(l => l.length > 5);
                lines.forEach(line => {
                    if (line.includes(':') && line.length < 150) {
                        const parts = line.split(':');
                        const k = parts[0].replace(/[•\-\*]/g, '').trim();
                        const v = parts.slice(1).join(':').trim();
                        if (k && v && k.length < 50) features[k] = v;
                    } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                        const cleanLine = line.replace(/[•\-\*]/g, '').trim();
                        if (cleanLine.length > 0) {
                            features['Highlights'] = (features['Highlights'] ? features['Highlights'] + ' | ' : '') + cleanLine;
                        }
                    }
                });
            }

            // Ekstrak Image URLs
            const images = await page.$$eval('.product-images img, .js-qv-product-images img', (imgs) => 
                imgs.map(img => img.dataset.imageLargeSrc || img.src)
            ).catch(() => []);

            await Dataset.pushData({
                url: request.url,
                name,
                brand,
                price,
                description,
                features,
                images,
                scrapedAt: new Date().toISOString(),
            });
        }
    },

    failedRequestHandler({ request, log }) {
        log.error(`Failed to crawl: ${request.url}`);
    },
});

log.info('🚀 Launching Full Dataset Scraper for AnekaFoto...');
await crawler.run([
    'https://shop.anekafoto.com/',
    'https://shop.anekafoto.com/2-home',
    'https://shop.anekafoto.com/brands'
]);
log.info('✅ Scrape complete. Run "npm run export" to generate CSV.');
