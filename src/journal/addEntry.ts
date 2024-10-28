import { WaveScraper } from '..';
import { sleep, clickXPath } from '../utils';

export type JournalEntry = {
  date: string, // NOTE: must be SQL format
  description: string;
  amount: number,
  from: string,
  to: string,
}

export async function addJournalEntry(this: WaveScraper, entry: JournalEntry) { 

  const page = await this.newPage("transactions");

  console.log("Clicking Button");
  await page.waitForSelector("div.wv-header__actions.transactions-list-V2__header__actions > div > div > button");
  await sleep(1500);
  await clickXPath(page, `//button[.='More']`);
  await sleep(500);

  console.log("Clicking XPath");
  await clickXPath(page, `//button[.="Add journal entry"]`);
  await sleep(1300);

  console.log("Entering Date");
  const dateSelector = ".transactions-list-v2__journal-entry__journal-entry-fields__date-form-field__date-field > input";
  await page.waitForSelector(dateSelector);
  await sleep(250);
  await page.focus(dateSelector);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Backspace");
  }
  await page.type(dateSelector, entry.date,{ delay: 20 });
  await sleep(100);

  console.log("Entering Description");
  await page.type(descriptionSelector, entry.description, { delay: 20 });
  await sleep(100);

  {
    // Not an error, click twice to engage things
    await clickXPath(page, `//span[contains(text(), 'Uncategorized Income')]`, 0);
    await sleep(300);
    const options = await page.$$(".wv-select__menu ul > div.wv-select__menu__option");
    // @ts-ignore
    const optiontext = await page.$$eval(".wv-select__menu ul > div.wv-select__menu__option", options => options.map(el => el.innerText));
    const index = optiontext.indexOf(entry.from);
    // await options[index].click();
    await page.evaluate(el => el.click(), options[index]);
    await sleep(1500);
  }

  { 
    await clickXPath(page, `//span[contains(text(), 'Uncategorized Expense')]`, 0);
    await sleep(300);
    const options = await page.$$(".wv-select__menu ul > div.wv-select__menu__option");
    // @ts-ignore
    const optiontext = await page.$$eval(".wv-select__menu ul > div.wv-select__menu__option", options => options.map(el => el.innerText));
    const index = optiontext.indexOf(entry.to);
    // await options[index].click();
    await page.evaluate(el => el.click(), options[index]);

    await sleep(1500);
  }


  await page.type(srcAmountSelector, entry.amount.toString(), {delay: 20});
  await sleep(150);
  //@ts-ignore
  await page.type(dstAmountSelector, entry.amount.toString(), {delay: 20});
  await sleep(500);

  await clickXPath(page, "//button[contains(text(), 'Save')]", 0);
  await sleep(3000)
}
const srcAmountSelector = "#transaction-details-tabs-panel-0 > div > div > div.line-item-section.line-item-section__tablet > div:nth-child(1) > div > div > div.wv-form--vertical > div.wv-form-field.is-floating.fs-unmask > div > div > span > input";
const dstAmountSelector = "#transaction-details-tabs-panel-0 > div > div > div.line-item-section.line-item-section__tablet > div:nth-child(2) > div > div > div.wv-form--vertical > div.wv-form-field.is-floating.fs-unmask > div > div > span > input";
const descriptionSelector = "#transaction-details-tabs-panel-0 > div > div > div.transactions-list-v2__journal-entry__journal-entry-fields > div.wv-form-field.is-floating.transactions-list-v2__journal-entry__journal-entry-fields__description-form-field.is-stacked.fs-exclude > div > div > input"