import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const url = 'https://shop.anekafoto.com/home/3529-fujifilm-xc-15-45mm-f35-56-ois-pz.html';
    
    console.log(`Analyzing: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Get all image tags and their src/alt/id/class
    const images = await page.$$eval('img', (imgs) => imgs.map(img => ({
        src: img.src,
        id: img.id,
        class: img.className,
        alt: img.alt,
        width: img.width,
        height: img.height
    })));

    fs.writeFileSync('product_images_analysis.json', JSON.stringify(images, null, 2));
    console.log('Analysis complete. Results in product_images_analysis.json');

    await browser.close();
})();
