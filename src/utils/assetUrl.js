export function assetUrl(path) {
  const normalized = path.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${normalized}`
}

/* Article art is authored with human filenames, spaces and all. */
export function encodedAssetUrl(src) {
  if (/^(?:[a-z]+:)?\/\//i.test(src) || /^(?:data|blob):/i.test(src)) {
    return src
  }

  const encoded = src
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return assetUrl(encoded)
}
