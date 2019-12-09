window.addEventListener('load', async () => {
  const response = await fetch('hypermarket-49-2019.pdf');
  const arrayBuffer = await response.arrayBuffer();
  const document = await pdfjsLib.getDocument(arrayBuffer).promise;
  process(document);
});
