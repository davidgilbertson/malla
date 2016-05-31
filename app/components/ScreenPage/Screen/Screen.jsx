import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';

import BoxListContainer from '../../BoxListContainer/BoxListContainer.jsx';
import HelpPanel from '../../HelpPanel/HelpPanel.jsx';
import ScreenHeader from '../ScreenHeader/ScreenHeader.jsx';

import {
  css,
  snap,
} from '../../../utils';

import {
  BREAKPOINTS,
  CLICK_LENGTH_MS,
  COLORS,
  DIMENSIONS,
  GRID_SIZE,
  TOOLS,
} from '../../../constants.js';

const styles = {
  workspace: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    left: 0,
    right: 0,
    top: DIMENSIONS.SPACE_L,
    bottom: DIMENSIONS.SPACE_M,
    background: COLORS.WHITE,
    [BREAKPOINTS.TABLET_LANDSCAPE]: {
      left: DIMENSIONS.SPACE_M,
      right: DIMENSIONS.SPACE_M,
      ...css.shadow('large'),
    }
  },
  canvas: {
    flex: '0 1 100%',
    position: 'relative', // to contain absolute descendants
    overflow: 'auto',
    backgroundImage: 'url(/images/grid-dot-gray_20x20.gif)',
    backgroundSize: '10px 10px',
    backgroundPosition: '1px 1px',
    cursor: 'crosshair',
    boxShadow: `inset 1px 1px ${COLORS.WHITE}, inset -2px -2px ${COLORS.WHITE}`, // covers dots near the edge
  },
  betaFooter: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    padding: '7px 10px',
    fontWeight: 400,
    fontSize: 12,
    color: COLORS.GRAY_DARK,
    textAlign: 'center',
  },
};

class Screen extends Component {
  constructor(props) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.sendBox = this.sendBox.bind(this);

    this.dragStartTime = null;
    this.isMoving = false;
    this.startX = 0;
    this.startY = 0;
    this.placeholderStyle = {
      display: 'none',
      border: '1px solid grey',
      width: 100,
      height: 100,
      position: 'fixed',
      top: 0,
      left: 0,
    };
  }

  onDragStart(e) {
    if (e.target !== e.currentTarget) return; // only work with clicks originating on the canvas

    this.props.boxActions.setActiveBox(null); // deselect all boxes

    this.isMoving = true;
    this.dragStartTime = performance.now();
    e.preventDefault();

    const mouseDims = e.touches ? e.touches[0] : e;
    this.startX = snap(mouseDims.pageX);
    this.startY = snap(mouseDims.pageY);

    const x = snap(mouseDims.pageX);
    const y = snap(mouseDims.pageY);

    this.placeholderEl.style.transform = `translate(${x}px, ${y}px)`;
    this.placeholderEl.style.width = '0px';
    this.placeholderEl.style.height = '0px';
    this.placeholderEl.style.display = 'block';

    window.addEventListener('mousemove', this.onDragMove, false);
    window.addEventListener('mouseup', this.onDragEnd, false);
    window.addEventListener('touchmove', this.onDragMove, false);
    window.addEventListener('touchend', this.onDragEnd, false);
  }

  onDragMove(e) {
    if (!this.isMoving) return;

    const mouseDims = e.touches ? e.touches[0] : e;

    this.placeholderEl.style.width = `${snap(mouseDims.pageX) - this.startX}px`;
    this.placeholderEl.style.height = `${snap(mouseDims.pageY) - this.startY}px`;
  }

  onDragEnd() {
    this.isMoving = false;

    const relativeDims = this.getRelativeDims(this.placeholderEl);

    const moreThanGridWidth = relativeDims.width >= GRID_SIZE;
    const moreThanGridHeight = relativeDims.height >= GRID_SIZE;
    const moreThanAClick = performance.now() - this.dragStartTime > CLICK_LENGTH_MS;

    if (moreThanAClick && (moreThanGridWidth || moreThanGridHeight)) {
      this.sendBox(relativeDims);
    }

    this.placeholderEl.style.display = 'none';

    window.removeEventListener('mousemove', this.onDragMove, false);
    window.removeEventListener('mouseup', this.onDragEnd, false);
    window.removeEventListener('touchmove', this.onDragMove, false);
    window.removeEventListener('touchend', this.onDragEnd, false);
  }

  sendBox(dims) {
    const type = this.props.currentTool === TOOLS.LABEL
      ? TOOLS.LABEL
      : TOOLS.TEXT;

    this.props.boxActions.add({
      ...dims,
      type,
    });

  }

  getRelativeDims(el) {
    const childDims = el.getBoundingClientRect();
    const parentDims = el.parentElement.getBoundingClientRect();

    return {
      top: snap(childDims.top - parentDims.top),
      left: snap(childDims.left - parentDims.left),
      width: snap(childDims.width),
      height: snap(childDims.height),
    };
  }

  render() {
    return (
      <div style={styles.workspace}>
        <ScreenHeader {...this.props}/>
        
        <div
          style={styles.canvas}
          onMouseDown={this.onDragStart}
          onTouchStart={this.onDragStart}
        >
          <BoxListContainer />
  
          <div
            ref={el => this.placeholderEl = el}
            style={this.placeholderStyle}
          ></div>
        </div>

        <HelpPanel />

        <footer
          style={styles.betaFooter}
        >
          {MALLA_TEXT.betaDisclaimer}
        </footer>
      </div>
    );
  }
}

Screen.propTypes = {
  // state
  user: PropTypes.object.isRequired,
  currentTool: PropTypes.string.isRequired,

  // actions
  boxActions: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired,
  showTooltip: PropTypes.func.isRequired,
};

export default Radium(Screen);
