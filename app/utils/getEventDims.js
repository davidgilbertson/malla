import {snap} from './snap.js';

export function getEventDims(e, opts = {}) {
  const dims = e.touches ? e.touches[0] : e;
  const result = {
    x: dims.pageX,
    y: dims.pageY,
  };

  if (opts.relative) {
    // gets the equivalent of 'offsetX' and 'offsetY'
    const targetElPosPageLeft = e.currentTarget.getBoundingClientRect().left;
    const targetElScrollLeft = e.currentTarget.scrollLeft;
    result.x = result.x - targetElPosPageLeft + targetElScrollLeft;

    const targetElPosPageTop = e.currentTarget.getBoundingClientRect().top;
    const targetElScrollTop = e.currentTarget.scrollTop;
    result.y = result.y - targetElPosPageTop + targetElScrollTop;
  }

  if (opts.snap) {
    result.x = snap(result.x);
    result.y = snap(result.y);
  }

  return result;
}
