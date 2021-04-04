# Albert

Trying to see if by reading texts and images from Albert offer catalog PDF,
keeping a track of their coordinates and clustering them by proximity, I can
scrape this PDF and extract the item price and photo associations.

## Running

`node extract` to generate `data` directory with extracted image and text bounds
and `python3 -m http.server` and `http://localhost:8000` to view the extracted
data.

## To-Do

### Use `canvas` to render the images and texts instead of pure HTML elements

This will make it easier to crop to the viewport size and to add UI around the
rendered page.

### Scrape page viewport size and prevent viewport overflow in the viewer app

By switching to `canvas` (which is another todo), this will just be a matter of
setting the correct canvas dimensions.

### Figure out why some of the images do not show or show elsewhere/covered

Comparing the viewer application render with the PDF page, some images are
completely missing and some are misplaced. There's bound to be some errors with
the calculations. See the viewer app UI todo for debugging tool improvement.

### Add viewer UI to turn on/off individual images and texts for debugging

Add a list of texts and images with checkboxes to be able to turn on and off the
individual elements for easier visual debugging. Also display element metadata
in the list.

### Figure out how to get rid of mask-type faux-images not actually in the PDF

Are all of those images identified by `objId` masks? If so, remove them.

### Rank image and text pairs by closeness to bounds not the center

Provide multiple candidates for each image so that things that sit in the middle
appear for both and hopefully some of the images are then excluded as masks,
graphics etc.

Also maybe consider whether just simple overlap is enough to associate texts to
an image in all/most cases. Text pattern matching could do the rest of the job
after.
