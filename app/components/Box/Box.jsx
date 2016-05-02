import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import {
  css,
  getDeltaXY,
  getEventDims,
} from '../../utils';

import {
  ANIMATION_DURATION,
  COLORS,
  GRID_SIZE,
} from '../../constants.js';

const HANDLE_SIZE = 40;
const DRAG_TYPES = {
  MOVE: 'MOVE',
  TOP: 'TOP',
  RIGHT: 'RIGHT',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT',
};

const Box = ({box, boxActions}) => {

  const styles = {
    box: {
      position: 'absolute',
      ...css.border(1, 'dashed', COLORS.GRAY_LIGHT),
      left: 0,
      top: 0,
      width: box.width + 1, // so it covers the grid
      height: box.height + 1, // so it covers the grid
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
    controls: {
      display: 'none',
    },
    deleteText: {
      position: 'absolute',
      bottom: -30,
      right: 0,
      padding: 5,
      textAlign: 'right',
      textDecoration: 'underline',
      color: COLORS.ACCENT,
      fontWeight: 700,
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
    styles.controls.display = 'block';
    styles.box = {
      ...styles.box,
      ...styles.boxSelected,
    }
  }

  const drag = {
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    boxElement: null,
    dragType: '',
    isMoving: false,
  };

  const maybeDeleteBox = () => {
    const sure = window.confirm('If you delete this and it is being used, things will break. Cool?');

    if (sure) {
      boxActions.remove(box.id);
    }
  };

  const resize = () => {
    if (!drag.isMoving) return;

    requestAnimationFrame(resize);

    if (!drag.lastX || !drag.lastY) return;

    const {x, y} = getDeltaXY(drag);

    switch (drag.dragType) {
      case DRAG_TYPES.MOVE :
        drag.boxElement.style.transform = `translate(${box.left + x}px, ${box.top + y}px)`;
        break;

      case DRAG_TYPES.TOP :
        drag.boxElement.style.height = `${box.height - y}px`;
        drag.boxElement.style.transform = `translate(${box.left}px, ${box.top + y}px)`;
        break;

      case DRAG_TYPES.RIGHT :
        drag.boxElement.style.width = `${box.width + x}px`;
        break;

      case DRAG_TYPES.BOTTOM :
        drag.boxElement.style.height = `${box.height + y}px`;
        break;

      case DRAG_TYPES.LEFT :
        drag.boxElement.style.width = `${box.width - x}px`;
        drag.boxElement.style.transform = `translate(${box.left + x}px, ${box.top}px)`;
        break;
    }
  };

  const onDragStart = (dragType, e) => {
    if (!box.selected) return; // only move a box if it is selected
    if (e.target !== e.currentTarget) return; // only work with clicks originating on the element
    
    e.preventDefault();

    const {x, y} = getEventDims(e);
    drag.isMoving = true;
    drag.dragType = dragType;
    drag.startX = x;
    drag.startY = y;
    drag.lastX = x;
    drag.lastY = y;

    requestAnimationFrame(resize);

    window.addEventListener('mousemove', onDragMove, false);
    window.addEventListener('mouseup', onDragEnd, false);
    window.addEventListener('touchmove', onDragMove, false);
    window.addEventListener('touchend', onDragEnd, false);
  };

  const onDragMove = (e) => {
    const {x, y} = getEventDims(e);

    drag.lastX = x;
    drag.lastY = y;
  };

  const onDragEnd = () => {
    drag.isMoving = false;

    const newBoxProps = {};

    const {x, y} = getDeltaXY(drag);

    switch (drag.dragType) {
      case DRAG_TYPES.MOVE :
        newBoxProps.left = Math.max(0, box.left + x);
        newBoxProps.top = Math.max(0, box.top + y);
        break;

      case DRAG_TYPES.TOP :
        newBoxProps.top = Math.max(0, box.top + y);
        newBoxProps.height = Math.max(GRID_SIZE, box.height - y);
        break;

      case DRAG_TYPES.RIGHT :
        newBoxProps.width = Math.max(GRID_SIZE, box.width + x);
        break;

      case DRAG_TYPES.BOTTOM :
        newBoxProps.height = Math.max(GRID_SIZE, box.height + y);
        break;

      case DRAG_TYPES.LEFT :
        newBoxProps.left = Math.max(0, box.left + x);
        newBoxProps.width = Math.max(GRID_SIZE, box.width - x);
        break;
    }

    console.log('  --  >  Box.jsx:219 > onDragEnd');
    boxActions.update(box.id, newBoxProps);
    
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
        style={styles.controls}
      >
        <button
          style={styles.deleteText}
          onClick={maybeDeleteBox}
        >Delete</button>
        <div
          style={[styles.handle, styles.handleTop]}
          onMouseDown={onDragStart.bind(null, DRAG_TYPES.TOP)}
          onTouchStart={onDragStart.bind(null, DRAG_TYPES.TOP)}
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
        <div
          style={[styles.handle, styles.handleRight]}
          onMouseDown={onDragStart.bind(null, DRAG_TYPES.RIGHT)}
          onTouchStart={onDragStart.bind(null, DRAG_TYPES.RIGHT)}
        ></div>
      </div>

      <div
        style={styles.contents}
        onClick={() => {
          if (window.getSelection().toString()) return; // do nothing if the user was selecting text
          // really this should be a three-way toggle. Sitting/moving/typing
          boxActions.select(box.id);
        }}
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
  boxActions: PropTypes.object.isRequired,
};

export default Radium(Box);
