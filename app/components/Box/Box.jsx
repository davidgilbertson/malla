import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';
import cloneDeep from 'lodash/cloneDeep';

import {
  css,
  eventWasAClick,
  getDeltaXY,
  getEventDims,
} from '../../utils';

import {
  BOX_MODES,
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

const baseStyles = {
  box: {
    position: 'absolute',
    ...css.border(1, 'dashed', COLORS.GRAY_LIGHT),
    left: 0,
    top: 0,
    backgroundColor: COLORS.WHITE,
    cursor: 'pointer',
  },
  handles: {
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
  displayText: {
    width: '100%',
    height: '100%',
    padding: 10,
  },
  textArea: {
    display: 'none',
    width: '100%',
    height: '100%',
    padding: 10,
    fontFamily: 'inherit', // TODO (davidg): put in a reset
    fontSize: 'inherit', // TODO (davidg): ditto
    border: 0,
  },
};

class Box extends Component {
  constructor(props) {
    super(props);

    this.dragInfo = {
      boxElement: null, // set by ref
      isMoving: false,
      dragStartTime: 0,
      dragType: '', // one of DRAG_TYPES
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
    };

    this.maybeDeleteBox = this.maybeDeleteBox.bind(this);
    this.resize = this.resize.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onTextAreaChange = this.onTextAreaChange.bind(this);
  }

  maybeDeleteBox() {
    const sure = window.confirm('If you delete this and it is being used, things will break. Cool?');

    if (sure) this.props.boxActions.remove(this.props.box.id);
  };

  resize() {
    if (!this.dragInfo.isMoving) return;
    const {box} = this.props;

    requestAnimationFrame(this.resize);

    if (!this.dragInfo.lastX || !this.dragInfo.lastY) return;

    const {x, y} = getDeltaXY(this.dragInfo);

    switch (this.dragInfo.dragType) {
      case DRAG_TYPES.MOVE :
        this.boxElement.style.transform = `translate(${box.left + x}px, ${box.top + y}px)`;
        break;

      case DRAG_TYPES.TOP :
        this.boxElement.style.height = `${box.height - y}px`;
        this.boxElement.style.transform = `translate(${box.left}px, ${box.top + y}px)`;
        break;

      case DRAG_TYPES.RIGHT :
        this.boxElement.style.width = `${box.width + x}px`;
        break;

      case DRAG_TYPES.BOTTOM :
        this.boxElement.style.height = `${box.height + y}px`;
        break;

      case DRAG_TYPES.LEFT :
        this.boxElement.style.width = `${box.width - x}px`;
        this.boxElement.style.transform = `translate(${box.left + x}px, ${box.top}px)`;
        break;
    }
  };

  onDragStart(dragType, e) {
    const {box} = this.props;

    if (box.mode === BOX_MODES.TYPING) return; // only move a box in move mode

    if (e.target !== e.currentTarget) return; // only work with clicks originating on the element

    this.dragInfo.dragStartTime = performance.now();

    if (box.mode === BOX_MODES.MOVING) {
      e.preventDefault();

      const {x, y} = getEventDims(e);
      this.dragInfo.dragType = dragType;
      this.dragInfo.isMoving = true;
      this.dragInfo.startX = x;
      this.dragInfo.startY = y;
      this.dragInfo.lastX = x;
      this.dragInfo.lastY = y;

      requestAnimationFrame(this.resize);

      window.addEventListener('mousemove', this.onDragMove, false);
      window.addEventListener('touchmove', this.onDragMove, false);
    }

    window.addEventListener('mouseup', this.onDragEnd, false);
    window.addEventListener('touchend', this.onDragEnd, false);
  }

  onDragMove(e) {
    const {x, y} = getEventDims(e);

    this.dragInfo.lastX = x;
    this.dragInfo.lastY = y;
  }

  onDragEnd() {
    this.dragInfo.isMoving = false;
    const {box, boxActions} = this.props;

    if (eventWasAClick(this.dragInfo)) {
      if (box.mode === BOX_MODES.SITTING) { // put the sitting box into move mode
        if (window.getSelection().toString()) return; // do nothing if the user was selecting text

        boxActions.setMode(box.id, BOX_MODES.MOVING);
      } else if (box.mode === BOX_MODES.MOVING) { // if it was clicked in move mode, put it into typing mode
        boxActions.setMode(box.id, BOX_MODES.TYPING);
      }
    } else if (box.mode === BOX_MODES.MOVING) { // if it was dragged in move mode, move the thing
      // else this was a drag, move the box
      this.updateBoxAfterDrag(this.dragInfo);
    } // If this was a drag, but the box wasn't in moving mode, ignore it

    window.removeEventListener('mousemove', this.onDragMove, false);
    window.removeEventListener('mouseup', this.onDragEnd, false);
    window.removeEventListener('touchmove', this.onDragMove, false);
    window.removeEventListener('touchend', this.onDragEnd, false);
  };

  onTextAreaChange(e) {
    const text = e.target.value;

    this.props.boxActions.update(
      this.props.box.id,
      {text},
    );
  }

  updateBoxAfterDrag(dragInfo) {
    console.log('  --  >  Box.jsx:225 > updateBoxAfterDrag' );
    const {box, boxActions} = this.props;
    const newBoxProps = {};

    const {x, y} = getDeltaXY(dragInfo);

    switch (dragInfo.dragType) {
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

    boxActions.update(box.id, newBoxProps);
  }

  componentDidUpdate(prevProps) {
    // If the box just entered typing mode, focus the input element
    if (prevProps.box.mode !== BOX_MODES.TYPING && this.props.box.mode === BOX_MODES.TYPING) {
      this.textAreaEl.focus();
    }
  }

  componentDidMount() {
    // a box will mount in typing mode when it's just been added
    if (this.props.box.mode === BOX_MODES.TYPING) {
      this.textAreaEl.focus();
    }
  }

  render() {
    const {box} = this.props;

    const styles = cloneDeep(baseStyles);

    styles.box.width = box.width + 1; // so it covers the grid
    styles.box.height = box.height + 1; // so it covers the grid
    styles.box.transform = `translate(${box.left}px, ${box.top}px)`;

    if (box.mode === BOX_MODES.MOVING) {
      styles.handles.display = 'block';
      styles.box = {
        ...styles.box,
        ...css.border(1, 'solid', COLORS.GRAY),
        ...css.shadow('large'),
        cursor: 'move',
        zIndex: 1,
      };
    }

    if (box.mode === BOX_MODES.TYPING) {
      styles.textArea.display = 'block';
      styles.box = {
        ...styles.box,
        borderWidth: 0, // the text area will get focus ring
      };
      styles.displayText.display = 'none';
    }

    return (
      <div
        // key={box.id}
        ref={el => this.boxElement = el}
        style={styles.box}
      >
        <div
          style={styles.handles}
        >
          <button
            style={styles.deleteText}
            onClick={this.maybeDeleteBox}
          >Delete</button>
          <div
            style={[styles.handle, styles.handleTop]}
            onMouseDown={this.onDragStart.bind(this, DRAG_TYPES.TOP)}
            onTouchStart={this.onDragStart.bind(this, DRAG_TYPES.TOP)}
          ></div>
          <div
            style={[styles.handle, styles.handleBottom]}
            onMouseDown={this.onDragStart.bind(this, DRAG_TYPES.BOTTOM)}
            onTouchStart={this.onDragStart.bind(this, DRAG_TYPES.BOTTOM)}
          ></div>
          <div
            style={[styles.handle, styles.handleLeft]}
            onMouseDown={this.onDragStart.bind(this, DRAG_TYPES.LEFT)}
            onTouchStart={this.onDragStart.bind(this, DRAG_TYPES.LEFT)}
          ></div>
          <div
            style={[styles.handle, styles.handleRight]}
            onMouseDown={this.onDragStart.bind(this, DRAG_TYPES.RIGHT)}
            onTouchStart={this.onDragStart.bind(this, DRAG_TYPES.RIGHT)}
          ></div>
        </div>

        <textarea
          ref={el => this.textAreaEl = el}
          style={styles.textArea}
          defaultValue={box.text}
          onChange={this.onTextAreaChange}
        />

        <div
          style={styles.displayText}
          onMouseDown={this.onDragStart.bind(this, DRAG_TYPES.MOVE)}
          onTouchStart={this.onDragStart.bind(this, DRAG_TYPES.MOVE)}
          // onClick={(e) => {
          //   console.log('clicked:', e.target);
          //   if (window.getSelection().toString()) return; // do nothing if the user was selecting text
          //
          //   if (box.mode === BOX_MODES.SITTING) {
          //     boxActions.setMode(box.id, BOX_MODES.MOVING);
          //   } else if (box.mode === BOX_MODES.MOVING) {
          //     boxActions.setMode(box.id, BOX_MODES.TYPING); // TODO (davidg): no possible as hidden when TYPING
          //   } else {
          //     boxActions.setMode(box.id, BOX_MODES.SITTING);
          //   }
          // }}
        >
          {box.text}
      </div>
      </div>
    );
  }
}

Box.propTypes = {
  box: PropTypes.object.isRequired,
  boxActions: PropTypes.object.isRequired,
};

export default Radium(Box);
