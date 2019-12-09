# Albert PDF

Trying to see if by reading texts and images from a PDF, keeping a track of
their coordinates and clustering them by proximity, I can scrape this PDF and
extract the item price and photo associations.

## To-Do

### Read the PDF spec and implement the text layout algorithms

https://www.adobe.com/content/dam/acom/en/devnet/pdf/pdfs/pdf_reference_archives/PDFReference.pdf

### Consider using Hummus even though it is discontinued

https://github.com/galkahana/HummusJS

### Cross validate with `textContents`

https://github.com/dunso/pdf-parser/blob/master/src/pdf2json/pdf2json.js

Make sure I have a solution for following the text state and transforms which
matches the results of `textContents` and then try to extend that to images.
