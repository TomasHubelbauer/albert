const playwright = require('playwright');
const path = require('path');
const fs = require('fs-extra');

void async function () {
  const browser = await playwright.firefox.launch({ headless: false });
  try {
    const page = await browser.newPage();
    await page.goto('file://' + path.join(__dirname, 'hypermarket-49-2019.pdf'));

    // Wait for the document and the viewer to load
    await page.waitForFunction(() => PDFViewerApplication.pdfDocument);

    // Use PDF.js API to extract image bounds (flattened on the `canvas` unlike texts which are their own `spans`)
    // TODO: Extract texts from the spans instead because it is more straightforward then unrolling the ops
    // TODO: Extract images some other way because it is too finicky from the ops and args (canvas metadata, PDFViewerApplication fields?)
    const data = await page.evaluate(async () => {
      const doc = PDFViewerApplication.pdfDocument;
      const pages = {};
      for (let number = 1; number <= 0 /* document.numPages */; number++) {
        const page = await doc.getPage(number);
        pages[number] = { texts: [], images: [] };

        let textMatrix;
        let imageMatrix;
        const ops = await page.getOperatorList();
        for (let index = 0; index < ops.fnArray.length; index++) {
          const fn = ops.fnArray[index];
          const args = ops.argsArray[index];

          switch (fn) {
            case pdfjsLib.OPS.setTextMatrix: {
              textMatrix = args;
              break;
            }
            case pdfjsLib.OPS.showText: {
              if (args.length !== 1) {
                throw new Error('Expected text to be an array with a single array element.');
              }

              const text = args[0].filter(a => a.unicode).map(a => a.unicode).join('').trim();
              if (!text) {
                break;
              }

              // For the matrix see https://github.com/mozilla/pdf.js/issues/10498
              pages[number].texts.push({ text, x: textMatrix[4], y: page.view[3] - textMatrix[5] + textMatrix[3] })
              break;
            }
            case pdfjsLib.OPS.transform: {
              imageMatrix = args;
              break;
            }
            case pdfjsLib.OPS.paintImageXObject: {
              const obj = await page.objs.get(args[0]);

              /** @type {Uint8ClampedArray} */
              const _data = obj.data;

              /** @type {Number} */
              const width = obj.width;

              /** @type {Number} */
              const height = obj.height;

              // TODO: Replace img with canvas and push these as ImageData to it
              // Swap lines to go top to bottom instead of bottom to top
              // const data = new Uint8Array(_data.length);
              // for (let y = 0; y < height; y++) {
              //   data.set(_data.slice((height - y - 1) * width * 3, (height - y - 1) * width * 3 + width * 3), y * width * 3);

              //   // Convert from BGR to RGB
              //   for (let x = 0; x < width; x++) {
              //     const offset = y * width * 3 + x * 3;
              //     const slice = data.slice(offset, offset + 3).reverse();
              //     data.set(slice, offset);
              //   }
              // }

              // For the matrix see https://github.com/mozilla/pdf.js/issues/10498
              pages[number].images.push({ x: imageMatrix[4], y: page.view[3] - imageMatrix[5] + imageMatrix[3] });

              // TODO: Figure out why the scale here gives weird numbers, do the previous transforms affect this?
              // If yes I might need to keep the track of them and multiply them as they come to get the correct scale here.
              // const [_scaleX, _skewY, _skewX, _scaleY, transformX, transformY] = imageMatrix;

              // TODO: Adjust `y` to be distance from top not from bottom (PDF default) by subtracting it from `page.view`
              // const x = Math.round(transformX);
              // const y = Math.round(transformY);
              break;
            }
          }
        }
      }

      const data = { pages };
      const keys = Object.keys(PDFViewerApplication);
      for (const key of keys) {
        const type = typeof PDFViewerApplication[key];
        if (type === 'object') {
          data[key] = !!PDFViewerApplication[key] ? Object.keys(PDFViewerApplication[key]) : null;
        }
        else {
          data[keys] = type;
        }
      }

      return data;
    });

    await fs.writeJSON('data.json', data, { spaces: 2 });
  }

  // Close the browser on error
  finally {
    await browser.close();
  }
}()
