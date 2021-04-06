# Albert

Trying to see if by reading texts and images from Albert offer catalog PDF,
keeping a track of their coordinates and clustering them by proximity, I can
scrape this PDF and extract the item price and photo associations.

## Running

`node extract` to generate `data` directory with extracted image and text bounds
and `python3 -m http.server` and `http://localhost:8000` to view the extracted
data.

## To-Do

### Scrape page viewport size and set the `canvas` size to the scraped size

Right now the page `canvas` size is hard-coded to 480x840 which looks correct.

### Figure out how to get rid of mask-type faux-images not actually in the PDF

Are all of those images identified by `objId` masks? If so, remove them.

### Rank image and text pairs by closeness to bounds not the center

Provide multiple candidates for each image so that things that sit in the middle
appear for both and hopefully some of the images are then excluded as masks,
graphics etc.

Also maybe consider whether just simple overlap is enough to associate texts to
an image in all/most cases. Text pattern matching could do the rest of the job
after.

### Display a locator glow around an image / a text on hover in the tool UI

Help locate the canvas elements by hovering them when the user hovers their
mouse cursor over their corresponding UI toggles.

### Add a checkbox for only displaying images not covered by other images

This should help us isolate only foreground images, but it will need a threshold
setting so that decorative junk doesn't remove product shot.
