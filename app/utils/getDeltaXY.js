import {snap} from './snap.js';

export function getDeltaXY(drag) {
  return {
    x: snap(drag.lastX - drag.startX),
    y: snap(drag.lastY - drag.startY),
  };
}
