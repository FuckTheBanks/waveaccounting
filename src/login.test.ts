import puppeteer from 'puppeteer';
import { login } from './login';
require('dotenv').config()

test('login completes', async () => {

  jest.setTimeout(5 * 60 * 1000)
  // const browser = await puppeteer.launch({
  //   headless: false
  // });

  const browserURL = 'http://127.0.0.1:21222';
  const browser = await puppeteer.connect({ browserURL });
  const page = await login(browser, process.env.WAVE_USERNAME!, process.env.WAVE_PASSWORD!);
  
  await page.close();

})