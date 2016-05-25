import {
  GRID_SIZE,
  CLICK_LENGTH_MS,
} from '../constants.js';

export function eventWasAClick(dragInfo) {
  const shorterThanClickLength = performance.now() - dragInfo.dragStartTime < CLICK_LENGTH_MS;
  const narrowerThanGrid = Math.abs(dragInfo.startX - dragInfo.lastX) < GRID_SIZE;
  const shorterThanGrid = Math.abs(dragInfo.startY - dragInfo.lastY) < GRID_SIZE;

  return shorterThanClickLength && narrowerThanGrid && shorterThanGrid;
}
