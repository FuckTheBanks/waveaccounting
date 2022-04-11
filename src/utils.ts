import { ElementHandle, Page } from "puppeteer";

export async function readText(page: Page, selector: string|ElementHandle) {
  const element = typeof selector == 'string' ? await page.$(selector) : selector;
  const s: string = await page.evaluate(element => element.innerText, element);
  return s.trim();
}

export async function clickXPath(page: Page, xpath: string, index?: number) {
  await page.waitForXPath(xpath)
  await sleep(100);
  const elements = await page.$x(xpath);
  if ((
    elements.length == 1 && index === undefined) || 
    (index != undefined && elements.length > index)
  ){
    // clicking the elink
    await elements[index ?? 0].click();
    return true;
  }
  return false;
}
export async function clickElement(page: Page, text: string, element: string="a", index?: number) {
  const r = await clickXPath(page, `//${element}[contains(., '${text}')]`, index);
  if (r) {
    await page.waitForNavigation({waitUntil: "networkidle2"});
  }
  return r;
} 

export const isVisible = async (el: ElementHandle) => 
  (await el.boundingBox()) != null; 

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
