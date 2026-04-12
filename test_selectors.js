import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    // Testing a different product that might have a data sheet
    const url = 'https://shop.anekafoto.com/home/2230-deity-microphone-v-mic-d4-mini.html';
    
    console.log(`Testing URL: ${url}`);
    try {
        await page.goto(url, { waitUntil: 'networkidle' });

        const name = await page.$eval('h1.page-title', (el) => el.innerText.trim()).catch(() => 'N/A');
        const price = await page.$eval('.current-price span', (el) => el.innerText.trim()).catch(() => 'N/A');
        
        // Check for Data Sheet again
        const dataSheetExists = await page.$('.data-sheet');
        console.log('Data sheet element exists:', !!dataSheetExists);

        if (dataSheetExists) {
            const features = await page.$$eval('.data-sheet dl.data-sheet', (dls) => {
                const data = {};
                dls.forEach(dl => {
                    const dt = dl.querySelector('dt.name');
                    const dd = dl.querySelector('dd.value');
                    if (dt && dd) data[dt.innerText.trim()] = dd.innerText.trim();
                });
                return data;
            });
            console.log('Features:', JSON.stringify(features, null, 2));
        } else {
            // Check if it's in a table or another list
            const tables = await page.$$eval('table', (ts) => ts.length);
            console.log('Number of tables:', tables);
        }

        console.log('--- Summary ---');
        console.log('Name:', name);
        console.log('Price:', price);

    } catch (e) {
        console.error('Error during test:', e);
    } finally {
        await browser.close();
    }
})();
