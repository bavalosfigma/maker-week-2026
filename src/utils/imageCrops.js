export const IMAGE_CROPS = {
  'book01.png': {
    imageWidth: 1024,
    imageHeight: 734,
    crop: { left: 76, top: 83, width: 843, height: 580 },
  },
  'book03.png': {
    imageWidth: 1024,
    imageHeight: 716,
    crop: { left: 56, top: 27, width: 928, height: 640 },
  },
  'pencils.png': {
    imageWidth: 954,
    imageHeight: 766,
    crop: { left: 83, top: 30, width: 836, height: 714 },
  },
  'collage01.png': {
    imageWidth: 1000,
    imageHeight: 606,
    crop: { left: 31, top: 35, width: 923, height: 528 },
  },
  'collage02.png': {
    imageWidth: 1000,
    imageHeight: 575,
    crop: { left: 0, top: 0, width: 1000, height: 575 },
  },
  'collage03.png': {
    imageWidth: 1000,
    imageHeight: 1000,
    crop: { left: 0, top: 0, width: 1000, height: 1000 },
  },
  'scissors.png': {
    imageWidth: 447,
    imageHeight: 789,
    crop: { left: 94, top: 43, width: 278, height: 697 },
  },
  'ruler.png': {
    imageWidth: 1024,
    imageHeight: 237,
    crop: { left: 44, top: 67, width: 954, height: 107 },
  },
  'sketchbook.png': {
    imageWidth: 1136,
    imageHeight: 863,
    crop: { left: 59, top: 25, width: 1011, height: 812 },
  },
  'calculator.png': {
    imageWidth: 561,
    imageHeight: 899,
    crop: { left: 30, top: 26, width: 510, height: 861 },
  },
  'collage.png': {
    imageWidth: 1435,
    imageHeight: 1256,
    crop: { left: 157, top: 144, width: 1177, height: 988 },
  },
  'headphones.png': {
    imageWidth: 649,
    imageHeight: 541,
    crop: { left: 12, top: 9, width: 634, height: 528 },
  },
  'mouse.png': {
    imageWidth: 534,
    imageHeight: 875,
    crop: { left: 44, top: 85, width: 414, height: 723 },
  },
  'pencil.png': {
    imageWidth: 869,
    imageHeight: 569,
    crop: { left: 22, top: 8, width: 830, height: 533 },
  },
  'screwdriver.png': {
    imageWidth: 300,
    imageHeight: 1297,
    crop: { left: 70, top: 30, width: 188, height: 1238 },
  },
  'stencil.png': {
    imageWidth: 1161,
    imageHeight: 924,
    crop: { left: 45, top: 40, width: 1083, height: 855 },
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
