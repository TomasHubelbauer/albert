# Albert

Trying to see if by reading texts and images from Albert offer catalog PDF,
keeping a track of their coordinates and clustering them by proximity, I can
scrape this PDF and extract the item price and photo associations.

## Running

`node extract` to generate `data` directory with extracted image and text bounds
and `python3 -m http.server` and `http://localhost:8000` to view the extracted
data.

## To-Do

### Scrape page viewport and prevent viewport overflow in the HTML replication

### Figure out why some of the images do not show or maybe show elsewhere/covered

### Figure out how to get rid of mask faux-images

Are all images identified by `objId` masks? If so, remove those.

### Rank image and text pairs by closeness to bounds not the center

Provide multiple candidates for each image so that things that sit in the middle
appear for both and hopefully some of the images are then excluded as masks,
graphics etc.
