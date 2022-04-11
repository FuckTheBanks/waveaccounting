import { Browser, Page } from "puppeteer";
import urls from './urls.json';

export async function login(browser: Browser, username: string, password: string) {

  const page = await browser.newPage();

  await page.goto(urls.login);
  
  // await page.type("#id_username", username, { delay: 20 });
  // await page.type("#id_password", password, { delay: 20 });

  // const waiter = page.waitForNavigation({
  //   waitUntil: "networkidle2",
  // });
  // await page.click("#js-sign-in-form > button");
  // await waiter;

  // Damn it wave, why you make things so hard?
  debugger;

  return page;
}
