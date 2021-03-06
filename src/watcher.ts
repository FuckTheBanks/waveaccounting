import { Page } from "puppeteer";
import { defer } from './defer';
import { debounce } from 'lodash';

/* eslint-disable @typescript-eslint/no-explicit-any */

type WatchCallback = (nodes: NodeList[]) => void;
const currentObservers = new Map<string, WatchCallback>();

function puppeteerMutationListener(selector: string, nodes: NodeList[]) {
  const cb = currentObservers.get(selector);
  if (!cb) console.warn('no cb for selctor: ' + selector);
  else cb(nodes);
}
interface WindowExt extends Window {
  puppeteerMutationListener: typeof puppeteerMutationListener;
}
declare let window: WindowExt;
export async function watchElement(page: Page, selector: string, callback: WatchCallback) {
 
  if (currentObservers.has(selector))
    throw new Error("Cannot watch selector twice");
  currentObservers.set(selector, callback);

  // because this exposed function survives navigations, we must only expose it once
  if (!(page as any).__FTBhasExposedListener) {
    await page.exposeFunction('puppeteerMutationListener', puppeteerMutationListener);
    (page as any).__FTBhasExposedListener = true;
  }
  
  await page.evaluate(selector => {
    console.log(`Watching: ${selector}`);
    const jswindow = window as any;
    const target = document.querySelector(selector);
    const observer = new MutationObserver(mutationsList => {
      const nodes = mutationsList.flatMap(m => m.addedNodes);
      window.puppeteerMutationListener(selector, nodes);
    });
    observer.observe(
      target,
      { 
        subtree: true,
        childList: true,
      },
    );
    jswindow[`puppeteerMutationObserver${selector}`] = observer;
    console.log(`Complete`);
  }, selector);
}

export async function stopWatchingElement(page: Page, selector: string) {
  if (currentObservers.has(selector))
  {
    currentObservers.delete(selector);
    await page.evaluate(selector => {
      const jswindow = window as any;
      jswindow[`puppeteerMutationObserver${selector}`]?.disconnect();
    }, selector);
  }
}

export async function getWaitableWatcher(page: Page, selector: string, idletime = 250) {
  // We cannot return our promise until we have setup the observers
  const r = defer();
  const rdelayed = debounce(async () => {
    await stopWatchingElement(page, selector);
    r.resolve()
  }, idletime)
  await watchElement(page, selector, () => {
    void rdelayed();
  });
  return {
    changed: r
  };
}