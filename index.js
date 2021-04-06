import url from './url.js';

window.addEventListener('load', async () => {
  const a = document.querySelector('a');
  a.href = url;

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

  if (window.location.hash) {
    await loadPage(window.location.hash.slice('#'.length));
  }
});

async function handleNumberButtonClick(/** @type {Event} */ event) {
  const number = event.currentTarget.dataset.number;
  window.location.hash = number;
  await loadPage(number);
}

async function loadImage(/** @type {string} */ src) {
  const img = document.createElement('img');
  return new Promise((resolve, reject) => {
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', event => reject(event.error));
    img.src = src;
  });
}

async function loadPage(/** @type {string} */ number) {
  const response = await fetch(`data/${number}/${number}.json`);
  const data = await response.json();
  renderPage(number, data);

  function handleImgInputChange(/** @type {Event} */ event) {
    const image = data.images[event.currentTarget.dataset.index];
    image.shown = event.currentTarget.checked;
    renderPage(number, data);
  }

  function handleTxtInputChange(/** @type {Event} */ event) {
    const text = data.texts[event.currentTarget.dataset.index];
    text.shown = event.currentTarget.checked;
    renderPage(number, data);
  }

  const imgDiv = document.querySelector('#imgDiv');
  imgDiv.innerHTML = '';
  for (let index = 0; index < data.images.length; index++) {
    const image = data.images[index];
    const div = document.createElement('div');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = true;
    input.dataset.index = index;
    input.addEventListener('change', handleImgInputChange);
    div.append(input);
    imgDiv.append(div);
    loadImage(`data/${number}/${image.data.name}`).then(img => div.append(img));
  }

  const txtDiv = document.querySelector('#txtDiv');
  txtDiv.innerHTML = '';
  for (let index = 0; index < data.texts.length; index++) {
    const text = data.texts[index];
    const div = document.createElement('div');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = true;
    input.dataset.index = index;
    input.addEventListener('change', handleTxtInputChange);
    div.append(input);
    div.append(text.data);
    txtDiv.append(div);
  }
}

async function renderPage(number, data) {
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (const image of data.images) {
    if (image.shown === false) {
      continue;
    }

    const img = await loadImage(`data/${number}/${image.data.name}`);
    context.drawImage(img, image.x, image.y, image.width, image.height);
  }

  for (const text of data.texts) {
    if (text.shown === false) {
      continue;
    }

    context.fillStyle = 'rgba(0, 0, 0, .75)';
    context.fillRect(text.x, text.y, text.width, text.height);
    //context.fillStyle = 'black';
    //context.fillText(text.data, text.x, text.y, text.width);
  }
}
