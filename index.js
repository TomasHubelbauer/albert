import url from './url.js';

window.addEventListener('load', async () => {
  const a = document.querySelector('a');
  a.href = url;

  if (window.location.hash) {
    await renderPage(window.location.hash.slice('#'.length));
    return;
  }

  const response = await fetch('data/data.json');
  const data = await response.json();

  const pageDiv = document.querySelector('#pageDiv');

  for (let number = 1; number <= data; number++) {
    const numberButton = document.createElement('button');
    numberButton.dataset.number = number;
    numberButton.textContent = number;
    numberButton.addEventListener('click', handleNumberButtonClick);
    pageDiv.append(numberButton);
  }
});

async function handleNumberButtonClick(/** @type {Event} */ event) {
  const number = event.currentTarget.dataset.number;
  window.location.hash = number;
  await renderPage(number);
}

async function loadImage(/** @type {string} */ src) {
  const img = document.createElement('img');
  return new Promise((resolve, reject) => {
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', event => reject(event.error));
    img.src = src;
  });
}

async function renderPage(/** @type {string} */ number) {
  const response = await fetch(`data/${number}/${number}.json`);
  const data = await response.json();

  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector('canvas');
  canvas.className = 'seen';

  const context = canvas.getContext('2d');

  for (const image of data.images) {
    context.drawImage(await loadImage(`data/${number}/${image.data.name}`), image.x, image.y, image.width, image.height);
  }

  for (const text of data.texts) {
    context.fillText(text.data, text.x, text.y, text.width);
    context.rect(text.x, text.y, text.width, text.height);
  }

  document.body.append(canvas);
}
