async function process(doc) {
  for (let number = 1; number <= 1 /* document.numPages */; number++) {
    const page = await doc.getPage(number);
    console.group(number);

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

          // // For the matrix see https://github.com/mozilla/pdf.js/issues/10498
          const textSpan = document.createElement('span');
          textSpan.style.left = textMatrix[4] + 'px';
          textSpan.style.top = (page.view[3] - textMatrix[5] + textMatrix[3] - 3) + 'px';
          //textSpan.style.width = textMatrix[0] + 'px';
          //textSpan.style.height = textMatrix[3] + 'px';
          textSpan.textContent = text;
          textSpan.title = text;
          document.body.append(textSpan);
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
          const imageImg = document.createElement('img');
          imageImg.style.left = imageMatrix[4] + 'px';
          imageImg.style.top = (page.view[3] - imageMatrix[5] + imageMatrix[3]) + 'px';
          imageImg.style.width = width + 'px';
          imageImg.style.height = height + 'px';
          document.body.append(imageImg);

          // TODO: Figure out why the scale here gives weird numbers, do the previous transforms affect this?
          // If yes I might need to keep the track of them and multiply them as they come to get the correct scale here.
          // const [_scaleX, _skewY, _skewX, _scaleY, transformX, transformY] = imageMatrix;

          // TODO: Adjust `y` to be distance from top not from bottom (PDF default) by subtracting it from `page.view`
          // const x = Math.round(transformX);
          // const y = Math.round(transformY);
          break;
        }
      }

      console.groupEnd();
    }
  }
}
