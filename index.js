const playwright = require('playwright');
const path = require('path');
const fs = require('fs-extra');

void async function () {
  await fs.remove('data');
  await fs.ensureDir('data');

  const browser = await playwright.firefox.launch({ headless: false });
  try {
    const page = await browser.newPage();
    await page.goto('file://' + path.join(__dirname, 'hypermarket-49-2019.pdf'));
    await page.waitForFunction(() => PDFViewerApplication && PDFViewerApplication.pdfDocument);

    const length = await page.evaluate(() => PDFViewerApplication.pdfDocument.numPages);
    for (let index = 0; index < length; index++) {
      const number = index + 1;
      console.log(`Scraping ${number}/${length}`);

      const item = await page.evaluate(async (number) => {
        const item = { images: [], texts: [] };
        const page = await PDFViewerApplication.pdfDocument.getPage(number);
        const viewport = page.getViewport({ scale: 1 });

        // Create a new canvas for each page otherwise PDF.js throws
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        document.body.innerHTML = '';
        document.body.append(canvas);

        const context = canvas.getContext('2d');
        let undefer;
        const deferred = new Promise(resolve => undefer = resolve);
        const imageLayer = {
          beginLayout: () => { },
          endLayout: undefer,
          appendImage: ({ left: x, top: y, width, height, imgData, objId }) => {
            if (!imgData) {
              // TODO: Fallback: commonObjs
              const img = page.objs.get(objId);
              const canvas = window.document.createElement('canvas');
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              const context = canvas.getContext('2d');
              context.drawImage(img, 0, 0);
              imgData = context.getImageData(0, 0, img.naturalWidth, img.naturalHeight);

              // TODO: Verify this is always the case for images which come like this
              top -= height;
            }

            console.log(number, x, y, width, height, imgData);
            if (!imgData) {
              alert('No image data!');
              throw new Error('No image data!');
            }

            const canvas = document.createElement('canvas');
            canvas.width = imgData.width;
            canvas.height = imgData.height;
            const context = canvas.getContext('2d');

            /** @type {Uint8ClampedArray} */
            let array;
            switch (imgData.data.length) {
              case imgData.width * imgData.height * 3: {
                array = new Uint8ClampedArray(imgData.width * imgData.height * 4);
                for (let index = 0; index < array.length; index++) {
                  // Set alpha channel to full
                  if (index % 4 === 3) {
                    array[index] = 17;
                  }
                  // Copy RGB channel components from the original array
                  else {
                    array[index] = imgData.data[~~(index / 4) * 3 + (index % 4)];
                  }
                }

                break;
              }
              case imgData.width * imgData.height * 4: {
                array = imgData.data;
                break;
              }
              default: {
                alert('Unknown imgData format!');
              }
            }

            context.putImageData(new ImageData(array, imgData.width, imgData.height), 0, 0);
            const data = { width: imgData.width, height: imgData.height, url: canvas.toDataURL() };
            item.images.push({ x, y, width, height, data });
          },
        };

        page.render({ canvasContext: context, viewport, imageLayer });
        await deferred;

        for (const { transform: [, , , , x, y], width, height, str: data } of (await page.getTextContent()).items) {
          item.texts.push({ x, y: viewport.height - y - height, width, height, data });
        }

        return item;
      }, number);

      await fs.ensureDir('data/' + number);

      let counter = 0;
      for (const image of item.images) {
        counter++;

        const buffer = new Buffer.from(image.data.url.slice('data:image/png;base64,'.length), 'base64');
        await fs.writeFile(`data/${number}/${counter}.png`, buffer);

        delete image.data.url;
        image.data.name = counter + '.png';
      }

      await fs.writeJSON(`data/${number}/page.json`, item, { spaces: 2 });
      await fs.copy('page.html', `data/${number}/page.html`);
      await fs.copy('page.js', `data/${number}/page.js`);
      await fs.copy('page.css', `data/${number}/page.css`);
      console.log(`Content saved ${number}/${length}`);
    }
  }

  // Close the browser on error
  finally {
    await browser.close();
  }
}()
