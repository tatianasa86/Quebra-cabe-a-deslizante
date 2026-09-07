export function getEmptyIndex(tiles: number[], size: number): number {
  const emptyVal = size * size - 1;
  return tiles.indexOf(emptyVal);
}

export function getAdjacentIndices(emptyIdx: number, size: number): number[] {
  const r = Math.floor(emptyIdx / size);
  const c = emptyIdx % size;
  const adjs: number[] = [];
  if (r > 0) adjs.push(emptyIdx - size); // Above
  if (r < size - 1) adjs.push(emptyIdx + size); // Below
  if (c > 0) adjs.push(emptyIdx - 1); // Left
  if (c < size - 1) adjs.push(emptyIdx + 1); // Right
  return adjs;
}

export function checkVictory(tiles: number[]): boolean {
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] !== i) return false;
  }
  return true;
}

export function createSolvableShuffle(size: number): number[] {
  const total = size * size;
  const tiles = Array.from({ length: total }, (_, i) => i);
  const emptyVal = total - 1;
  let emptyIdx = total - 1;
  const shuffleSteps = total * 18;
  let lastIdx = -1;

  for (let step = 0; step < shuffleSteps; step++) {
    const validMoves = getAdjacentIndices(emptyIdx, size).filter((idx) => idx !== lastIdx);
    const chosen = validMoves[Math.floor(Math.random() * validMoves.length)];
    tiles[emptyIdx] = tiles[chosen];
    tiles[chosen] = emptyVal;
    lastIdx = emptyIdx;
    emptyIdx = chosen;
  }

  // Safety check: if by chance it's already solved, do one more move and swap back
  if (checkVictory(tiles)) {
    const adjs = getAdjacentIndices(emptyIdx, size);
    const chosen = adjs[0];
    tiles[emptyIdx] = tiles[chosen];
    tiles[chosen] = emptyVal;
  }

  return tiles;
}

export function getTileBackgroundPosition(value: number, size: number): { xPercent: number; yPercent: number } {
  if (size <= 1) return { xPercent: 0, yPercent: 0 };
  const originalRow = Math.floor(value / size);
  const originalCol = value % size;
  const xPercent = (originalCol / (size - 1)) * 100;
  const yPercent = (originalRow / (size - 1)) * 100;
  return { xPercent, yPercent };
}
