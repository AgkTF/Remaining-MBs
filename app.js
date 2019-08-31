const puppeteer = require('puppeteer');
const screenshot = 'router-login.png';
(async () => {
	const url = 'http://192.168.0.1/login.asp';
	try {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.setViewport({ width: 1920, height: 1080 });
		await page.goto(url);
		await page.type('#ID', 'admin');
		await page.type('#PASSWORD', 'thp2safer');
		await Promise.all([
			page.waitForNavigation(),
			page.click('#wan_change_mode')
		]);
		await page.screenshot({ path: screenshot, fullPage: true });
		browser.close();
		console.log('See screenshot: ' + screenshot);
	} catch (error) {
		console.log(error);
	}
})();