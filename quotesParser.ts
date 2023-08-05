import puppeteer from 'puppeteer';
import fs from 'fs';

// SHUFFLE QUOTES

// (async () => {
//   const storeQuotesJSON = await fs.promises.readFile('./quotes.json', 'utf8');
//   const storeQuotesParsed = JSON.parse(storeQuotesJSON);

//   fs.promises.writeFile(
//     './quotes.json',
//     JSON.stringify({
//       quotes: storeQuotesParsed.quotes
//         .map((value: unknown) => [Math.random(), value])

//         // Sort using each element random number
//         .sort(([a]: number[], [b]: number[]) => a - b)

//         // Return back to an array of values
//         .map((entry: (number | unknown)[]) => entry[1]),
//     })
//   );
// })();

// ADD QUOTES

// (async () => {
//   // Launch the browser and open a new blank page
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   // Navigate the page to a URL
//   await page.goto('https://ru.citaty.net/avtory/plutarkh/');

//   // Set screen size
//   await page.setViewport({ width: 1080, height: 1024 });

//   const quotes = await page.evaluate(() =>
//     Array.from(
//       document.querySelectorAll('[data-quote-content]'),
//       (element) => element.textContent
//     )
//   );

//   const quotesFormatted = quotes.map((quote) => ({
//     text: quote?.replace(/['“„]/g, ''),
//     author: 'Плутарх',
//   }));

//   const storeQuotesJSON = await fs.promises.readFile('./quotes.json', 'utf8');
//   const storeQuotesParsed = JSON.parse(storeQuotesJSON);

//   fs.promises.writeFile(
//     './quotes.json',
//     JSON.stringify({
//       quotes: [...storeQuotesParsed.quotes, ...quotesFormatted],
//     })
//   );

//   await browser.close();
// })();
