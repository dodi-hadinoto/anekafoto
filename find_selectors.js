import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const url = 'https://shop.anekafoto.com/brand/97-7artisans';
    
    console.log(`Analyzing: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Find all links that might be products
    const links = await page.$$eval('a', (as) => as.map(a => ({
        href: a.href,
        text: a.innerText,
        class: a.className,
        parentClass: a.parentElement.className
    })).filter(l => l.href.includes('/home/') || l.href.includes('/p/')));

    console.log('Sample Product Links:', JSON.stringify(links.slice(0, 10), null, 2));

    await browser.close();
})();
