import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const url = 'https://shop.anekafoto.com/home/3927-godox-movelink-ii-m2-compact-2-person-wireless-microphone-system.html';
    await page.goto(url);
    
    // Logic from crawler.js
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
    
    console.log('Final Features:', JSON.stringify(features, null, 2));
    
    await browser.close();
})();
