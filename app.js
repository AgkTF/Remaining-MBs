require('dotenv').config();
const puppeteer = require('puppeteer');
const screenshot = 'remaining-MBs.png';

(async () => {
	const url = process.env.URL;
	try {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.setViewport({ width: 1920, height: 1080 });
		await page.goto(url);
		await page.type('#ID', process.env.ID);
		await page.type('#PASSWORD', process.env.PASSWORD);

		// submit the form
		await Promise.all([
			page.waitForNavigation(),
			page.click('#wan_change_mode')
		]);

		// navigate to the sms page
		await Promise.all([page.waitForNavigation(), page.click('#navi-sms')]);

		// get the iframe
		const frame = page
			.frames()
			.find(frame => frame.name() === 'interFrame');

		await frame.click('a[href="#tabs-2"]');
		await frame.type('#ussd_cmd', '*414#');
		await frame.click('input[onclick="doSendUssd();"]');

		await frame.waitFor(5000);

		// read the remaining MBs
		const replyField = await frame.$('#ussd_read');
		const text = await frame.evaluate(
			element => element.textContent,
			replyField
		);

		// print the message to the console
		console.log('The remaining MBS: ', text);

		// take a screenshot of the current page
		await page.screenshot({ path: screenshot, fullPage: true });

		browser.close();

		console.log('See screenshot: ' + screenshot);
	} catch (error) {
		console.log(error);
	}
})();
