const { chromium } = require('playwright');

async function run() {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

    try {
        console.log("Navigating to MIDNIGHT theme...");
        await page.goto('http://localhost:3000/r/teste-5-004789', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        await page.screenshot({ path: '/home/helenilson/.gemini/antigravity/brain/2d98a524-b79d-4f4f-ba74-9d73965f4e0a/theme_midnight_final.png' });

        console.log("Navigating to ROYAL theme...");
        await page.goto('http://localhost:3000/r/teste-416808', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        await page.screenshot({ path: '/home/helenilson/.gemini/antigravity/brain/2d98a524-b79d-4f4f-ba74-9d73965f4e0a/theme_royal_final.png' });
        
        console.log("Navigating to Default theme...");
        await page.goto('http://localhost:3000/r/teste-579410', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        await page.screenshot({ path: '/home/helenilson/.gemini/antigravity/brain/2d98a524-b79d-4f4f-ba74-9d73965f4e0a/theme_default_final.png' });
        
        console.log("Done!");
    } catch(e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}

run();
