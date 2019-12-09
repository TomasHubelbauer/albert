const puppeteer = require('puppeteer-firefox');
const fs = require('fs-extra');

void async function () {
  const browser = await puppeteer.launch({ headless: false });
  const [page] = await browser.pages();

  await page.goto('https://www.albert.cz/aktualni-letaky/hypermarket-49-2019.pdf?field=pdf');
  // In Puppeteer Firefox, this will allow us to access texts with precise
  // placement, but not images, as those are flattened to a single full-page
  // canvas so it's impossible to cluster them together with the texts

  // So instead we go directly through the PDFJS API and just hijack the viewer
  // for the PDF load and PDFJS setup
  await page.evaluate(String(await fs.readFile('script.js')) + `process(PDFViewerApplication.pdfDocument)`);
}()
