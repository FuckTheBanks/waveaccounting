
import puppeteer from 'puppeteer';
import { login } from './login';
import urls from './urls.json';
import { addJournalEntry } from './journal/addEntry';

export class WaveScraper {

  browser: puppeteer.Browser;

  username: string;
  password: string;


  ///////////////////////////////////////////////////////////////////////
  // Construction functions
  private constructor(browser: puppeteer.Browser, username: string, password: string) {
    this.browser = browser;
    this.username = username;
    this.password = password;
  }
 
  public static async init(username?: string, password?: string, options?: puppeteer.BrowserLaunchArgumentOptions) {

    const user = username || process.env.WAVE_USERNAME;
    const pwd = password || process.env.WAVE_PASSWORD;
    if (!user || !pwd)
      throw new Error("Cannot initialize Payment Evolution scraper, no username or password")

    const browser = await puppeteer.launch(options);
    const pe = new WaveScraper(browser, user, pwd);
    const page = await pe.login();

    await page.close();
    return pe;
  }

  public async release() {
    await this.browser.close();
  }

  ///////////////////////////////////////////////////////////////////////
  // Data scraping
  
  public addJournalEntry = addJournalEntry;
  
  ///////////////////////////////////////////////////////////////////////
  // Helper functions

  public login = () => login(this.browser, this.username, this.password);
  public newPage = async (url?: string) => {
    const page = await this.browser.newPage();
    await page.goto(url ?? urls.app);
    return page;
  }
}