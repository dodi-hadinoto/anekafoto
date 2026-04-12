import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const url = 'https://shop.anekafoto.com/home/3927-godox-movelink-ii-m2-compact-2-person-wireless-microphone-system.html';
    console.log(`Navigating to ${url}...`);
    await page.goto(url);
    
    // Check for dl.data-sheet
    const hasDataSheet = await page.$('dl.data-sheet');
    console.log(`Has dl.data-sheet: ${!!hasDataSheet}`);
    
    if (hasDataSheet) {
        const text = await page.$eval('dl.data-sheet', el => el.innerText);
        console.log('Data Sheet Text:', text);
    } else {
        console.log('Trying alternative selectors for specs...');
        const altSelectors = ['.product-features', '.specs', '#product-details', '.data-sheet'];
        for (const sel of altSelectors) {
            const hasSel = await page.$(sel);
            console.log(`Has ${sel}: ${!!hasSel}`);
        }
    }
    
    const description = await page.$eval('#description, .product-description', el => el.innerText.substring(0, 500)).catch(() => 'N/A');
    console.log('Description Start:', description);
    
    await browser.close();
})();
