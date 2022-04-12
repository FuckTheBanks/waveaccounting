
import puppeteer from 'puppeteer';
import { login } from './login';
import urls from './urls.json';
import { addJournalEntry } from './journal/addEntry';
export { JournalEntry } from './journal/addEntry'

export class WaveScraper {

  browser: puppeteer.Browser;

  username: string;
  password: string;
  appId: string;


  ///////////////////////////////////////////////////////////////////////
  // Construction functions
  private constructor(browser: puppeteer.Browser, username: string, password: string, appId: string) {
    this.browser = browser;
    this.username = username;
    this.password = password;
    this.appId = appId;
  }
 
  public static async init(username?: string, password?: string, options?: puppeteer.BrowserLaunchArgumentOptions) {

    const user = username || process.env.WAVE_USERNAME;
    const pwd = password || process.env.WAVE_PASSWORD;
    const appId = password || process.env.WAVE_APPID;
    if (!user || !pwd || !appId)
      throw new Error("Cannot initialize Wave Accounting scraper, no username or password")

    const browserURL = 'http://127.0.0.1:21222';
    const browser = await puppeteer.connect({ browserURL });
    const pe = new WaveScraper(browser, user, pwd, appId);
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
  public newPage = async (path?: string) => {
    const page = await this.browser.newPage();
    await page.goto(`${urls.app}${this.appId}/${path}`);
    return page;
  }
}