import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const url = 'https://shop.anekafoto.com/home/3927-godox-movelink-ii-m2-compact-2-person-wireless-microphone-system.html';
    console.log(`Navigating to ${url}...`);
    await page.goto(url);
    
    console.log('--- #product-details HTML ---');
    const detailsHtml = await page.$eval('#product-details', el => el.innerHTML).catch(() => 'N/A');
    console.log(detailsHtml);
    
    console.log('--- #product-details Text ---');
    const detailsText = await page.$eval('#product-details', el => el.innerText).catch(() => 'N/A');
    console.log(detailsText);
    
    await browser.close();
})();
