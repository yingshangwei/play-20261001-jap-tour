export function googleMapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsDirections(origin: string, destination: string, travelMode: "driving" | "transit" | "walking") {
  const params = new URLSearchParams({ api: "1", origin, destination, travelmode: travelMode });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function withPublicAssetPrefix(path: string, assetPrefix: string) {
  if (/^(?:https?:)?\/\//.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${assetPrefix}${normalizedPath}`;
}
