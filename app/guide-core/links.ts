export function googleMapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function withPublicAssetPrefix(path: string, assetPrefix: string) {
  if (/^(?:https?:)?\/\//.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${assetPrefix}${normalizedPath}`;
}
