import { Browser, Page } from "puppeteer";
import urls from './urls.json';

export async function login(browser: Browser, username: string, password: string) {

  const page = await browser.newPage();

  await page.goto(urls.login);
  
  await page.type("#id_username", username, { delay: 20 });
  await page.type("#password-input", password, { delay: 20 });

  await Promise.all([
    page.click("#sign-in-button"),
    page.waitForNavigation({waitUntil: "networkidle2"})
  ])

  const delay = await page.waitForSelector("#Content .wv-logo")
  console.log("Login Complete: " + !!delay);

  // Damn it wave, why you make things so hard?
  // debugger;

  return page;
}
