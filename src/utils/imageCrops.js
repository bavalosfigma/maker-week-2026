export const IMAGE_CROPS = {
  'apple.png': {
    imageWidth: 1480,
    imageHeight: 1502,
    crop: { left: 15, top: 16, width: 1440, height: 1465 },
  },
  'book.png': {
    imageWidth: 1342,
    imageHeight: 1721,
    crop: { left: 0, top: 5, width: 1340, height: 1716 },
  },
  'calculator.png': {
    imageWidth: 561,
    imageHeight: 899,
    crop: { left: 30, top: 26, width: 510, height: 861 },
  },
  'chord.png': {
    imageWidth: 478,
    imageHeight: 518,
    crop: { left: 2, top: 8, width: 476, height: 508 },
  },
  'coffee.png': {
    imageWidth: 1000,
    imageHeight: 832,
    crop: { left: 32, top: 18, width: 959, height: 788 },
  },
  'cutpaper.png': {
    imageWidth: 1415,
    imageHeight: 1219,
    crop: { left: 0, top: 70, width: 1399, height: 1124 },
  },
  'flower.png': {
    imageWidth: 1195,
    imageHeight: 2600,
    crop: { left: 189, top: 83, width: 988, height: 2466 },
  },
  'guitarpedal.png': {
    imageWidth: 1064,
    imageHeight: 1362,
    crop: { left: 24, top: 33, width: 1010, height: 1310 },
  },
  'keyboard.png': {
    imageWidth: 2091,
    imageHeight: 759,
    crop: { left: 36, top: 36, width: 1994, height: 689 },
  },
  'markers.png': {
    imageWidth: 1042,
    imageHeight: 1042,
    crop: { left: 30, top: 16, width: 1002, height: 1007 },
  },
  'mouse.png': {
    imageWidth: 534,
    imageHeight: 875,
    crop: { left: 44, top: 85, width: 414, height: 723 },
  },
  'rock.png': {
    imageWidth: 1590,
    imageHeight: 1424,
    crop: { left: 0, top: 1, width: 1590, height: 1423 },
  },
  'screwdriver.png': {
    imageWidth: 270,
    imageHeight: 1198,
    crop: { left: 49, top: 27, width: 157, height: 1140 },
  },
  'stencil.png': {
    imageWidth: 1002,
    imageHeight: 444,
    crop: { left: 29, top: 29, width: 943, height: 387 },
  },
  'tape.png': {
    imageWidth: 672,
    imageHeight: 648,
    crop: { left: 20, top: 12, width: 612, height: 625 },
  },
  'record.png': {
    imageWidth: 1568,
    imageHeight: 1003,
    crop: { left: 215, top: 57, width: 1134, height: 864 },
  },
  'record-deck.png': {
    imageWidth: 1568,
    imageHeight: 1003,
    crop: { left: 215, top: 57, width: 1134, height: 864 },
  },
  'vinyl.png': {
    imageWidth: 1024,
    imageHeight: 1024,
    crop: { left: 66, top: 64, width: 892, height: 891 },
  },
}

export function getImageCrop(src) {
  if (!src) return null

  const filename = src.split('/').pop()?.split('?')[0]
  return IMAGE_CROPS[filename] ?? null
}

export function getCroppedLayout(imageMeta, displayWidth) {
  const { imageWidth, imageHeight, crop } = imageMeta
  const scale = displayWidth / crop.width

  return {
    containerWidth: displayWidth,
    containerHeight: displayWidth * (crop.height / crop.width),
    imageStyle: {
      width: `${imageWidth * scale}px`,
      height: `${imageHeight * scale}px`,
      marginLeft: `${-crop.left * scale}px`,
      marginTop: `${-crop.top * scale}px`,
    },
  }
}
