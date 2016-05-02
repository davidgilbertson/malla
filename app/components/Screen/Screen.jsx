import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';

import BoxListContainer from '../BoxListContainer/BoxListContainer.jsx';
import {snap} from '../../utils';
import {
  CLICK_LENGTH_MS,
  GRID_SIZE,
} from '../../constants.js';

const styles = {
  main: {
    flex: '0 1 100%',
    position: 'relative', // to contain absolute descendants
    overflow: 'auto',
  },
};

class Screen extends Component {
  constructor(props) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

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

    this.props.selectBox(null); // deselect all boxes

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
      this.props.addBox(relativeDims);
    }

    this.placeholderEl.style.display = 'none';

    window.removeEventListener('mousemove', this.onDragMove, false);
    window.removeEventListener('mouseup', this.onDragEnd, false);
    window.removeEventListener('touchmove', this.onDragMove, false);
    window.removeEventListener('touchend', this.onDragEnd, false);
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
      <div
        ref={el => this.screenEl = el}
        style={styles.main}
        onMouseDown={this.onDragStart}
        onTouchStart={this.onDragStart}
      >
        <BoxListContainer />

        <div
          ref={el => this.placeholderEl = el}
          style={this.placeholderStyle}
        ></div>
      </div>
    );
  }
}

Screen.propTypes = {
  addBox: PropTypes.func.isRequired,
  selectBox: PropTypes.func.isRequired,
};

export default Radium(Screen);
