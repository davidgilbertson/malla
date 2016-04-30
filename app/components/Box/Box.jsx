import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import css from '../../utils/css';
import {
  ANIMATION_DURATION,
  COLORS,
} from '../../constants';

const HANDLE_SIZE = 40;

const Box = ({box, selectBox}) => {
  const styles = {
    box: {
      position: 'absolute',
      ...css.border(1, 'dashed', COLORS.GRAY_LIGHT),
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
      cursor: 'pointer',
      transition: `${ANIMATION_DURATION}ms`,
      ':hover': {
        borderColor: COLORS.GRAY,
      },
    },
    boxSelected: {
      background: COLORS.WHITE,
      ...css.border(1, 'solid', COLORS.GRAY),
      ...css.shadow('large'),
      cursor: 'move',
      ':hover': {
        ...css.border(1, 'solid', COLORS.GRAY),
      },
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

  const onDragStart = (e) => {
    if (!box.selected) return;
    console.log('  --  >  Box.jsx:87 > onDragStart');
    window.addEventListener('mousemove', onDragMove, false);
    window.addEventListener('mouseup', onDragEnd, false);
    window.addEventListener('touchmove', onDragMove, false);
    window.addEventListener('touchend', onDragEnd, false);
  };

  const onDragMove = (e) => {
    console.log('  --  >  Box.jsx:96 > onDragMove');
  };

  const onDragEnd = (e) => {
    console.log('  --  >  Box.jsx:102 > onDragEnd');
    window.removeEventListener('mousemove', onDragMove, false);
    window.removeEventListener('mouseup', onDragEnd, false);
    window.removeEventListener('touchmove', onDragMove, false);
    window.removeEventListener('touchend', onDragEnd, false);
  };

  return (
    <div
      key={box.id}
      style={styles.box}
      onClick={() => selectBox(box.id)} // TODO (davidg): let a user select text without selecting box
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
    >
      <div style={styles.handles}>
        <div style={[styles.handle, styles.handleTop]}></div>
        <div style={[styles.handle, styles.handleRight]}></div>
        <div style={[styles.handle, styles.handleBottom]}></div>
        <div style={[styles.handle, styles.handleLeft]}></div>
      </div>

      <div style={styles.contents}>
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
