import { WaveScraper } from "..";
require('dotenv').config()

beforeEach(() => {
  jest.setTimeout(5 * 60 * 1000)
})

it('can fetch payroll Records', async () => {
  jest.setTimeout(5 * 60 * 1000);
  const wave = await WaveScraper.init(undefined, undefined, {
    headless: false
  })

  const r = await wave.addJournalEntry({
    date: "2022-03-01",
    description: "Testing Auto-input",
    from: "RBC",
    to: "TheCoin LoC",
    amount: 100,
  });
  await wave.release();
  console.log("Test Complete");
})
