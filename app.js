const puppeteer = require('puppeteer');
const screenshot = 'remaining-MBs.png';
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

		await Promise.all([page.waitForNavigation(), page.click('#navi-sms')]);

		const frame = page
			.frames()
			.find(frame => frame.name() === 'interFrame');

		await frame.click('a[href="#tabs-2"]');
		await frame.type('#ussd_cmd', '*414#');
		await frame.click('input[onclick="doSendUssd();"]');

		await frame.waitFor(5000);

		console.log('The remaining MBS: ', text);

		await page.screenshot({ path: screenshot, fullPage: true });

		browser.close();

		console.log('See screenshot: ' + screenshot);
	} catch (error) {
		console.log(error);
	}
})();
