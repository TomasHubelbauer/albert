window.addEventListener('load', async () => {
  const response = await fetch('page.json');
  const data = await response.json();

  for (const image of data.images) {
    const imageImg = document.createElement('img');
    imageImg.style.position = 'absolute';
    imageImg.style.left = image.x + 'px';
    imageImg.style.top = image.y + 'px';
    imageImg.style.width = image.width + 'px';
    imageImg.style.height = image.height + 'px';
    imageImg.src = image.data.name;
    document.body.append(imageImg);
  }

  for (const text of data.texts) {
    const textSpan = document.createElement('span');
    textSpan.style.position = 'absolute';
    textSpan.style.left = text.x + 'px';
    textSpan.style.top = text.y + 'px';
    textSpan.style.width = text.width + 'px';
    textSpan.style.height = text.height + 'px';
    textSpan.textContent = text.data;
    document.body.append(textSpan);
  }

  for (const text of data.texts) {
    const textX = text.x + text.width / 2;
    const textY = text.y + text.height / 2;
    let candidate;
    for (const image of data.images) {
      const imageX = image.x + image.width / 2;
      const imageY = image.y + image.height / 2;

      const dx = textX - imageX;
      const dy = textY - imageY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (!candidate || candidate.distance > d) {
        candidate = { image, distance: d };
      }
    }

    text.image = data.images.indexOf(candidate.image);
  }

  console.log(data.texts);

  for (const image of data.images) {
    const hr = document.createElement('hr');
    document.body.append(hr);

    const imageImg = document.createElement('img');
    imageImg.style.width = image.width + 'px';
    imageImg.style.height = image.height + 'px';
    imageImg.src = image.data.name;
    document.body.append(imageImg);

    const index = data.images.indexOf(image);
    const indexStrong = document.createElement('strong');
    indexStrong.textContent = '#' + index;
    document.body.append(indexStrong);

    for (const text of data.texts.filter(text => text.image === index)) {
      const candidateDiv = document.createElement('div');
      candidateDiv.textContent = text.data;
      document.body.append(candidateDiv);
    }
  }
});
