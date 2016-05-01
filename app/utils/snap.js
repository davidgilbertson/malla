import {GRID_SIZE} from '../constants';

export default function snap(num) {
  return Math.round(num / GRID_SIZE) * GRID_SIZE;
};
