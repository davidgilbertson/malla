import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';
import cloneDeep from 'lodash/cloneDeep';

import Icon from '../../../Icon/Icon.jsx';

import {
  css,
  eventWasAClick,
  getDeltaXY,
  getEventDims,
} from '../../../../utils';

import {
  BOX_MODES,
  BOX_TYPES,
  COLORS,
  ICONS,
  FONT_FAMILIES,
  GRID_SIZE,
  TOOLS,
  Z_INDEXES,
} from '../../../../constants.js';

const HANDLE_SIZE = 30;
const DRAG_TYPES = {
  MOVE: 'MOVE',
  TOP: 'TOP',
  RIGHT: 'RIGHT',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT',
};

const TEXT_PADDING = '4px 8px';

const baseStyles = {
  box: {
    position: 'absolute',
    ...css.border(1, 'dashed', COLORS.GRAY_LIGHT),
    left: 0,
    top: 0,
    backgroundColor: COLORS.WHITE,
    whiteSpace: 'pre-line', // keep line breaks
    cursor: 'pointer',
    fontFamily: FONT_FAMILIES.SERIF,
    fontSize: 15,
  },
  handles: {
    display: 'none',
  },
  deleteButton: {
    position: 'absolute',
    bottom: -6,
    right: -40,
    padding: 5,
    textAlign: 'right',
    color: COLORS.ACCENT,
    fontWeight: 700,
    fontFamily: FONT_FAMILIES.SANS_SERIF,
  },
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    backgroundColor: COLORS.ACCENT,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    ...css.shadow('medium'),
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
    padding: TEXT_PADDING,
    overflow: 'auto',
  },
  textArea: {
    display: 'none',
    width: '100%',
    height: '100%',
    padding: TEXT_PADDING,
    border: 0,
    resize: 'none',
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
    let sure = true;

    if (this.props.box.type !== BOX_TYPES.LABEL && this.props.box.text) {
      sure = window.confirm('If you delete this and it is being used, things will break. Cool?');
    }

    if (sure) this.props.boxActions.remove(this.props.id);
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
        this.boxElement.style.height = `${box.height - y + 1}px`;
        this.boxElement.style.transform = `translate(${box.left}px, ${box.top + y}px)`;
        break;

      case DRAG_TYPES.RIGHT :
        this.boxElement.style.width = `${box.width + x + 1}px`;
        break;

      case DRAG_TYPES.BOTTOM :
        this.boxElement.style.height = `${box.height + y + 1}px`;
        break;

      case DRAG_TYPES.LEFT :
        this.boxElement.style.width = `${box.width - x + 1}px`;
        this.boxElement.style.transform = `translate(${box.left + x}px, ${box.top}px)`;
        break;
    }
  };

  isInSittingMode({activeBox, id}) {
    return id !== activeBox.id;
  }

  isInMovingMode({activeBox, id}) {
    return id === activeBox.id && activeBox.mode === BOX_MODES.MOVING;
  }

  isInTypingMode({activeBox, id}) {
    return id === activeBox.id && activeBox.mode === BOX_MODES.TYPING;
  }

  onDragStart(dragType, e) {
    if (this.isInTypingMode(this.props)) return; // only move a box in move mode

    if (e.target !== e.currentTarget) return; // only work with clicks originating on the element

    this.dragInfo.dragStartTime = performance.now();

    if (this.isInMovingMode(this.props)) {
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
    } else {
      this.dragInfo.startX = 0;
      this.dragInfo.startY = 0;
      this.dragInfo.lastX = 0;
      this.dragInfo.lastY = 0;
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
    const {boxActions, id} = this.props;

    if (eventWasAClick(this.dragInfo)) {
      if (this.isInSittingMode(this.props)) { // put the sitting box into move mode
        if (window.getSelection().toString()) return; // do nothing if the user was selecting text

        boxActions.setActiveBox(id, BOX_MODES.MOVING);
      } else if (this.isInMovingMode(this.props)) { // if it was clicked in move mode, put it into typing mode
        // actually, unless the target was one of the handles. Then it shouldn't change the mode (a quick resize is a click)
        boxActions.setActiveBox(id, BOX_MODES.TYPING);
      }
    } else if (this.isInMovingMode(this.props)) { // if it was dragged in move mode, move the thing
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
      this.props.id,
      {text},
    );
  }

  updateBoxAfterDrag(dragInfo) {
    const {box, boxActions, id} = this.props;
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

    boxActions.update(id, newBoxProps);
  }

  componentDidUpdate(prevProps) {
    const wasNotInTypingMode = !this.isInTypingMode(prevProps);
    const isNowInTypingMode = this.isInTypingMode(this.props);

    if (wasNotInTypingMode && isNowInTypingMode) {
      this.textAreaEl.focus();
    }
  }

  shouldComponentUpdate(nextProps) {
    const textAreaNotFocused = document.activeElement !== this.textAreaEl;
    const leavingTypingMode = !this.isInTypingMode(nextProps);
    // don't update the component while the textarea is focused (messes with the cursor)
    return textAreaNotFocused || leavingTypingMode;
  }

  componentWillReceiveProps(nextProps) {
    const iAmTyping = document.activeElement === this.textAreaEl;
    const thereIsNewText = nextProps.box.text !== this.props.box.text;

    if (thereIsNewText && !iAmTyping) {
      this.textAreaEl.value = nextProps.box.text;
    }
  }

  componentDidMount() {
    // a box will mount in typing mode when it's just been added
    if (this.isInTypingMode(this.props)) {
      this.textAreaEl.focus();
    }
  }

  render() {
    const {box} = this.props;

    const styles = cloneDeep(baseStyles);

    styles.box.width = box.width + 1; // so it covers the grid
    styles.box.height = box.height + 1; // so it covers the grid
    styles.box.transform = `translate(${box.left}px, ${box.top}px)`;

    if (this.isInMovingMode(this.props)) {
      styles.handles.display = 'block';

      styles.box = {
        ...styles.box,
        borderWidth: 0,
        ...css.shadow('medium'),
        cursor: 'move',
        zIndex: Z_INDEXES.MOVING_BOX,
      };

      styles.displayText.overflow = 'hidden';
    }

    if (this.isInTypingMode(this.props)) {
      styles.textArea.display = 'block';
      styles.box = {
        ...styles.box, // TODO (davidg): what?
      };
      styles.displayText.display = 'none';
    }

    if (box.type === BOX_TYPES.LABEL) {
      styles.box = {
        ...styles.box,
        color: COLORS.PRIMARY_DARK,
        fontSize: 24,
        fontFamily: FONT_FAMILIES.CURSIVE,
        borderWidth: 0,
        backgroundColor: 'transparent',
      };

      styles.textArea.padding = 4;
      styles.displayText.padding = 4;
    }

    return (
      <div
        ref={el => this.boxElement = el}
        style={styles.box}
      >
        <div
          style={styles.handles}
        >
          <button
            style={styles.deleteButton}
            onClick={this.maybeDeleteBox}
            title="Delete this box"
          >
            <Icon
              size={25}
              icon={ICONS.BIN2}
              color={COLORS.GRAY_LIGHT}
            />
          </button>
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
        >
          {box.text}
        </div>
      </div>
    );
  }
}

Box.propTypes = {
  // state
  activeBox: PropTypes.object.isRequired,
  box: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,

  // actions
  boxActions: PropTypes.object.isRequired,
};

export default Radium(Box);
