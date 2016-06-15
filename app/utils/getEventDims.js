import {snap} from './snap.js';

export function getEventDims(e, opts = {}) {
  const dims = e.touches ? e.touches[0] : e;

  if (opts.snap) {
    return {
      x: snap(dims.pageX),
      y: snap(dims.pageY),
    };
  }

  return {
    x: dims.pageX,
    y: dims.pageY,
  };
}
