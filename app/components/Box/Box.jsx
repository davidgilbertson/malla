import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import css from '../../utils/css';
import snap from '../../utils/snap';

import {
  ANIMATION_DURATION,
  COLORS,
} from '../../constants';

const HANDLE_SIZE = 40;
const DRAG_TYPES = {
  MOVE: 'MOVE',
  TOP: 'TOP',
  RIGHT: 'RIGHT',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT',
};

const Box = ({box, selectBox, updateBox}) => {
  const styles = {
    box: {
      position: 'absolute',
      ...css.border(1, 'dashed', COLORS.GRAY_LIGHT),
      left: 0,
      top: 0,
      width: box.width,
      height: box.height,
      transform: `translate(${box.left}px, ${box.top}px)`,
      backgroundColor: COLORS.WHITE,
      cursor: 'pointer',
      transition: `borderColor ${ANIMATION_DURATION}ms`,
    },
    boxSelected: {
      ...css.border(1, 'solid', COLORS.GRAY),
      ...css.shadow('large'),
      cursor: 'move',
      zIndex: 1,
    },
    handles: {
      display: 'none',
    },
    handle: {
      position: 'absolute',
      width: HANDLE_SIZE,
      height: HANDLE_SIZE,
      backgroundColor: COLORS.ACCENT,
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      ...css.shadow(),
      opacity: 0.8,
    },
    handleTop: {
      top: 0,
      left: '50%',
      cursor: 'ns-resize',
    },
    handleRight: {
      top: '50%',
      right: -HANDLE_SIZE,
      cursor: 'ew-resize',
    },
    handleBottom: {
      bottom: -HANDLE_SIZE,
      left: '50%',
      cursor: 'ns-resize',
    },
    handleLeft: {
      top: '50%',
      left: 0,
      cursor: 'ew-resize',
    },
    contents: {
      width: '100%',
      height: '100%',
      padding: 10,
    }
  };

  if (box.selected) {
    styles.handles.display = 'block';
    styles.box = {
      ...styles.box,
      ...styles.boxSelected,
    }
  }

  const drag = {
    startX: null,
    startY: null,
    lastX: null,
    lastY: null,
    boxElement: null,
    dragType: null,
    isMoving: null,
  };

  const resize = () => {
    if (!drag.isMoving) return;

    requestAnimationFrame(resize);

    if (!drag.lastX || !drag.lastY) return;

    if (drag.dragType === DRAG_TYPES.MOVE) {
      const x = snap(drag.lastX - drag.startX);
      const y = snap(drag.lastY - drag.startY);

      drag.boxElement.style.transform = `translate(${box.left + x}px, ${box.top + y}px)`;
    } else if (drag.dragType === DRAG_TYPES.TOP) {
      const y = snap(drag.lastY - drag.startY);

      drag.boxElement.style.height = `${box.height - y}px`;
      drag.boxElement.style.transform = `translate(${box.left}px, ${box.top + y}px)`;
    } else if (drag.dragType === DRAG_TYPES.RIGHT) {
      const x = snap(drag.lastX - drag.startX);

      drag.boxElement.style.width = `${box.width + x}px`;
    } else if (drag.dragType === DRAG_TYPES.BOTTOM) {
      const y = snap(drag.lastY - drag.startY);

      drag.boxElement.style.height = `${box.height + y}px`;
    } else if (drag.dragType === DRAG_TYPES.LEFT) {
      const x = snap(drag.lastX - drag.startX);

      drag.boxElement.style.width = `${box.width - x}px`;
      drag.boxElement.style.transform = `translate(${box.left + x}px, ${box.top}px)`;
    }
  };

  const getDims = (e) => {
    const dims = e.touches ? e.touches[0] : e;

    return {
      x: dims.clientX,
      y: dims.clientY,
    };
  };

  const onDragStart = (dragType, e) => {
    if (!box.selected) return; // move do things if a box is selected
    if (e.target !== e.currentTarget) return; // only work with clicks originating on the element
    
    e.preventDefault();

    const {x, y} = getDims(e);
    drag.isMoving = true;
    drag.dragType = dragType;
    drag.startX = x; // TODO (davidg): do I need to snap here?
    drag.startY = y; // TODO (davidg): do I need to snap here?
    drag.lastX = x;
    drag.lastY = y;

    requestAnimationFrame(resize);

    window.addEventListener('mousemove', onDragMove, false);
    window.addEventListener('mouseup', onDragEnd, false);
    window.addEventListener('touchmove', onDragMove, false);
    window.addEventListener('touchend', onDragEnd, false);
  };

  const onDragMove = (e) => {
    const {x, y} = getDims(e);

    drag.lastX = x;
    drag.lastY = y;
  };

  const onDragEnd = () => {
    drag.isMoving = false;

    const newBoxProps = {};

    const x = snap(drag.lastX - drag.startX);
    const y = snap(drag.lastY - drag.startY);

    if (drag.dragType === DRAG_TYPES.MOVE) {
      newBoxProps.left = box.left + x;
      newBoxProps.top = box.top + y;
    } else if (drag.dragType === DRAG_TYPES.TOP) {
      newBoxProps.top = box.top + y;
      newBoxProps.height = box.height - y;
    } else if (drag.dragType === DRAG_TYPES.RIGHT) {
      newBoxProps.width = box.width + x;
    } else if (drag.dragType === DRAG_TYPES.BOTTOM) {
      newBoxProps.height = box.height + y;
    } else if (drag.dragType === DRAG_TYPES.LEFT) {
      newBoxProps.left = box.left + x;
      newBoxProps.width = box.width - x;
    }

    updateBox(box.id, newBoxProps);
    
    window.removeEventListener('mousemove', onDragMove, false);
    window.removeEventListener('mouseup', onDragEnd, false);
    window.removeEventListener('touchmove', onDragMove, false);
    window.removeEventListener('touchend', onDragEnd, false);
  };

  return (
    <div
      key={box.id}
      ref={el => drag.boxElement = el}
      style={styles.box}
    >
      <div
        style={styles.handles}
      >
        <div
          style={[styles.handle, styles.handleTop]}
          onMouseDown={onDragStart.bind(null, DRAG_TYPES.TOP)}
          onTouchStart={onDragStart.bind(null, DRAG_TYPES.TOP)}
        ></div>
        <div
          style={[styles.handle, styles.handleRight]}
          onMouseDown={onDragStart.bind(null, DRAG_TYPES.RIGHT)}
          onTouchStart={onDragStart.bind(null, DRAG_TYPES.RIGHT)}
        ></div>
        <div
          style={[styles.handle, styles.handleBottom]}
          onMouseDown={onDragStart.bind(null, DRAG_TYPES.BOTTOM)}
          onTouchStart={onDragStart.bind(null, DRAG_TYPES.BOTTOM)}
        ></div>
        <div
          style={[styles.handle, styles.handleLeft]}
          onMouseDown={onDragStart.bind(null, DRAG_TYPES.LEFT)}
          onTouchStart={onDragStart.bind(null, DRAG_TYPES.LEFT)}
        ></div>
      </div>

      <div
        style={styles.contents}
        onClick={() => selectBox(box.id)} // TODO (davidg): let a user select text without selecting box
        onMouseDown={onDragStart.bind(null, DRAG_TYPES.MOVE)}
        onTouchStart={onDragStart.bind(null, DRAG_TYPES.MOVE)}
      >
        {box.name}
      </div>
    </div>
  );
};

Box.propTypes = {
  box: PropTypes.object.isRequired,
  selectBox: PropTypes.func.isRequired,
};

export default Radium(Box);
