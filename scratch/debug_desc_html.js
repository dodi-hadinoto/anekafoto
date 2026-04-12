import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const url = 'https://shop.anekafoto.com/home/3927-godox-movelink-ii-m2-compact-2-person-wireless-microphone-system.html';
    await page.goto(url);
    
    console.log('--- #description HTML ---');
    const descHtml = await page.$eval('#description', el => el.innerHTML).catch(() => 'N/A');
    console.log(descHtml);
    
    await browser.close();
})();
