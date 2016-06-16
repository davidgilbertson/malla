import React from 'react';
const {Component, PropTypes} = React;
import isEqual from 'lodash/isEqual';

import {
  css,
  getEventDims,
} from '../../../../utils';
import {
  COLORS,
  GRID_SIZE,
  Z_INDEXES,
} from '../../../../constants.js';

const HANDLE_SIZE = 30;
const RESIZE = {
  TOP: 'TOP',
  RIGHT: 'RIGHT',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT',
};

class Draggable extends Component {
  constructor(props) {
    super(props);

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);

    this.resizeTop = this.resizeTop.bind(this);
    this.resizeBottom = this.resizeBottom.bind(this);
    this.resizeLeft = this.resizeLeft.bind(this);
    this.resizeRight = this.resizeRight.bind(this);

    this.resizeStart = this.resizeStart.bind(this);
    this.resizing = this.resizing.bind(this);
    this.resizeEnd = this.resizeEnd.bind(this);

    this.startDrag = this.startDrag.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.endDrag = this.endDrag.bind(this);

    this.state = {
      isDragging: false,
      isHovered: false,
      isResizing: false,
      width: this.props.width,
      height: this.props.height,
      left: this.props.left,
      top: this.props.top,
    };

    this.startX = 0;
    this.startY = 0;
    this.didMove = false;
  }

  onMouseOver() {
    this.setState({isHovered: true});
  }

  onMouseOut(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    this.setState({isHovered: false});
  }

  resizeTop(e) {
    this.resizeStart(e, RESIZE.TOP);
  }

  resizeBottom(e) {
    this.resizeStart(e, RESIZE.BOTTOM);
  }

  resizeLeft(e) {
    this.resizeStart(e, RESIZE.LEFT);
  }

  resizeRight(e) {
    this.resizeStart(e, RESIZE.RIGHT);
  }

  resizeStart(e, direction) {
    e.stopPropagation(); // block the movement handler

    const {x, y} = getEventDims(e, {snap: true});
    this.startX = x;
    this.startY = y;
    this.startWidth = this.state.width;
    this.startHeight = this.state.height;
    this.startLeft = this.state.left;
    this.startTop = this.state.top;
    this.resizeDirection = direction;

    this.setState({isResizing: true});

    window.addEventListener('mousemove', this.resizing);
    window.addEventListener('mouseup', this.resizeEnd);
  }

  resizing(e) {
    e.preventDefault();
    const {x, y} = getEventDims(e, {snap: true});
    let newDims = {};

    const MIN_SIZE = GRID_SIZE * 2;

    if (this.resizeDirection === RESIZE.RIGHT || this.resizeDirection === RESIZE.LEFT) {
      const movement = x - this.startX;

      if (this.resizeDirection === RESIZE.RIGHT) {
        if (this.startWidth + movement >= MIN_SIZE) {
          newDims.width = this.startWidth + movement;
        }
      }

      if (this.resizeDirection === RESIZE.LEFT) {
        const left = this.startLeft + movement;
        const width = this.startWidth - movement;

        if (left >= 0 && width >= MIN_SIZE) {
          newDims.width = width;
          newDims.left = left;
        }
      }

      if (Math.abs(this.state.width - newDims.width) >= GRID_SIZE) {
        this.didMove = true;

        this.setState(newDims);
      }
    }

    if (this.resizeDirection === RESIZE.TOP || this.resizeDirection === RESIZE.BOTTOM) {
      const movement = y - this.startY;

      if (this.resizeDirection === RESIZE.BOTTOM) {
        if (this.startHeight + movement >= MIN_SIZE) {
          newDims.height = this.startHeight + movement;
        }
      }

      if (this.resizeDirection === RESIZE.TOP) {
        const height = this.startHeight - movement;
        const top = this.startTop + movement;

        if (top >= 0 && height >= MIN_SIZE) {
          newDims.height = height;
          newDims.top = top;
        }
      }

      if (Math.abs(this.state.height - newDims.height) >= GRID_SIZE) {
        this.didMove = true;

        this.setState(newDims);
      }
    }
  }

  resizeEnd() {
    this.setState({isResizing: false});

    if (this.didMove) {
      this.didMove = false;

      this.props.onUpdate({
        left: this.state.left,
        top: this.state.top,
        width: this.state.width,
        height: this.state.height,
      });
    }

    window.removeEventListener('mousemove', this.resizing);
    window.removeEventListener('mouseup', this.resizeEnd);
  }

  startDrag(e) {
    this.props.onMouseDown(e);
    if (this.props.disableDragging) return;
    this.setState({isDragging: true});

    const {x, y} = getEventDims(e, {snap: true});

    this.startX = x;
    this.startY = y;

    this.offsetX = e.currentTarget.offsetLeft;
    this.offsetY = e.currentTarget.offsetTop;

    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('mouseup', this.endDrag);
  }

  onDrag(e) {
    e.preventDefault();
    const {x, y} = getEventDims(e, {snap: true});

    const hasMovedXEnough = Math.abs(x - this.state.left) >= GRID_SIZE;
    const hasMovedYEnough = Math.abs(y - this.state.top) >= GRID_SIZE;
    
    if (!hasMovedXEnough && !hasMovedYEnough) return;

    this.didMove = true;

    const left = Math.max(0, x - this.startX + this.offsetX);
    const top = Math.max(0, y - this.startY + this.offsetY);

    this.setState({left, top});
  }

  endDrag() {
    this.setState({isDragging: false});

    if (this.didMove) {
      this.didMove = false;

      this.props.onUpdate({
        left: this.state.left,
        top: this.state.top,
      });
    } else {
      this.props.onClick();
    }

    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('mouseup', this.endDrag);
  }

  componentWillReceiveProps(newProps) {
    // if something else updates the position, update the box
    // setStates will be batched
    if (newProps.left !== this.props.left) this.setState({left: newProps.left});
    if (newProps.top !== this.props.top) this.setState({top: newProps.top});
    if (newProps.width !== this.props.width) this.setState({width: newProps.width});
    if (newProps.height !== this.props.height) this.setState({height: newProps.height});
  }

  shouldComponentUpdate(newProps, nextState) {
    if (this.state !== nextState) return true;

    return (
      newProps.left !== this.props.left ||
      newProps.top !== this.props.top ||
      newProps.width !== this.props.width ||
      newProps.height !== this.props.height ||
      newProps.disableDragging !== this.props.disableDragging ||
      !isEqual(newProps.style, this.props.style)
    );
  }

  render() {
    const showHandles = (this.state.isHovered || this.state.isResizing) && !this.props.disableDragging;
    const bringToFront = this.state.isHovered || this.state.isDragging || this.state.isResizing || this.props.disableDragging;

    const styles = {
      draggable: {
        position: 'absolute',
        left: this.state.left,
        top: this.state.top,
        width: this.state.width,
        height: this.state.height,
        cursor: 'pointer',
        zIndex: this.props.disableDragging ? Z_INDEXES.MOVING_BOX + 1 : bringToFront ? Z_INDEXES.MOVING_BOX : null,
      },
      handle: {
        position: 'absolute',
        width: HANDLE_SIZE,
        height: HANDLE_SIZE,
        backgroundColor: COLORS.ACCENT,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        ...css.shadow('medium'),
        opacity: showHandles ? .8 : 0,
        pointerEvents: showHandles ? null : 'none',
        transition: showHandles ? `opacity 700ms 300ms` : `opacity 400ms`,
        zIndex: Z_INDEXES.MOVING_BOX + 1, // always above so as they fade away...
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
    };

    return (
      <div
        style={{...styles.draggable, ...this.props.style}}
        onMouseDown={this.startDrag}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onDoubleClick={this.props.onDoubleClick}
      >
        {this.props.children}
        <div
          style={{...styles.handle, ...styles.handleTop}}
          onMouseDown={this.resizeTop}
        ></div>
        <div
          style={{...styles.handle, ...styles.handleBottom}}
          onMouseDown={this.resizeBottom}
        ></div>
        <div
          style={{...styles.handle, ...styles.handleLeft}}
          onMouseDown={this.resizeLeft}
        ></div>
        <div
          style={{...styles.handle, ...styles.handleRight}}
          onMouseDown={this.resizeRight}
        ></div>
      </div>
    );
  }
}

Draggable.propTypes = {
  // props
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  disableDragging: PropTypes.bool.isRequired,
  style: PropTypes.object,

  // methods
  onUpdate: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func,
};

Draggable.defaultProps = {
  onDoubleClick: () => {},
};

export default Draggable;
