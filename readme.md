# Albert PDF

Trying to see if by reading texts and images from a PDF, keeping a track of
their coordinates and clustering them by proximity, I can scrape this PDF and
extract the item price and photo associations.

## Running

`node .`

## To-Do

### Scrap using ops and args and see if I can extract image bounds from PDF.js

I would have to reimplement PDF.js if I went by the ops and args, instead, it is
needed to inspect the `PDFViewerApplication` for fields (including nested) which
could be used to extract image bounds or to monkey-patch the PDF.js rendered so
that when it renders an image onto the canvas, it also passes along the bounds
to me.

Use https://mozilla.github.io/pdf.js/web/viewer.html to debug PDF.js.
