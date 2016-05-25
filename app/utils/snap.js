import {GRID_SIZE} from '../constants.js';

export function snap(num) {
  return Math.round(num / GRID_SIZE) * GRID_SIZE;
}
