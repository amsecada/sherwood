export function fitMap(points, width, height) {
  const valid = points.filter(p => typeof p.latitude === 'number' && typeof p.longitude === 'number' && Number.isFinite(p.latitude) && Number.isFinite(p.longitude) && p.latitude >= 41.4 && p.latitude <= 42.3 && p.longitude >= -88.3 && p.longitude <= -87.4);
  if (!valid.length || width <= 0 || height <= 0) return {zoom: 8, originX: 0, originY: 0, markers: [], tiles: []};
  const projected = valid.map(p => ({...p, worldX: (p.longitude + 180) / 360, worldY: (1 - Math.asinh(Math.tan(p.latitude * Math.PI / 180)) / Math.PI) / 2}));
  const minX = Math.min(...projected.map(p => p.worldX)), maxX = Math.max(...projected.map(p => p.worldX));
  const minY = Math.min(...projected.map(p => p.worldY)), maxY = Math.max(...projected.map(p => p.worldY));
  let zoom = 18;
  while (zoom > 8 && ((maxX - minX) * 256 * 2 ** zoom > width - 80 || (maxY - minY) * 256 * 2 ** zoom > height - 80)) zoom--;
  const scale = 256 * 2 ** zoom;
  const originX = (minX + maxX) / 2 * scale - width / 2, originY = (minY + maxY) / 2 * scale - height / 2;
  const markers = projected.map(p => ({...p, x: p.worldX * scale - originX, y: p.worldY * scale - originY}));
  const tiles = [];
  for (let x = Math.floor(originX / 256); x < Math.ceil((originX + width) / 256); x++) {
    for (let y = Math.floor(originY / 256); y < Math.ceil((originY + height) / 256); y++) {
      if (x >= 0 && y >= 0 && x < 2 ** zoom && y < 2 ** zoom) tiles.push({z: zoom, x, y, left: x * 256 - originX, top: y * 256 - originY});
    }
  }
  return {zoom, originX, originY, markers, tiles};
}
