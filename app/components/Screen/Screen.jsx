import React from 'react';
const {Component} = React;
import Radium from 'radium';

import Box from '../Box/Box.jsx';
import css from '../../utils/css';
import {
  COLORS,
  CLICK_LENGTH_MS,
  GRID_SIZE,
} from '../../utils/constants';

let ID = 0;
const getGuid = () => ID++;

const styles = {
  main: {
    position: 'absolute',
    width: 1366,
    height: 768,
    top: 160,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: COLORS.WHITE,
    backgroundImage: 'url(/images/grid-dot_10x10.gif)',
    ...css.shadow('large'),
    cursor: 'crosshair',
  },
};

class Screen extends Component {
  constructor(props) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.selectBox = this.selectBox.bind(this);

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

    this.state = {
      boxes: [],
    };
  }

  onDragStart(e) {
    if (e.target !== e.currentTarget) return; // only work with clicks originating on the canvas

    this.selectBox(null); // deselect all boxes

    this.isMoving = true;
    this.dragStartTime = performance.now();
    e.preventDefault();

    const mouseDims = e.touches ? e.touches[0] : e;
    this.startX = this.snap(mouseDims.clientX);
    this.startY = this.snap(mouseDims.clientY);

    const screenElDims = this.screenEl.getBoundingClientRect();

    const x = this.snap(mouseDims.clientX - screenElDims.left);
    const y = this.snap(mouseDims.clientY - screenElDims.top);
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
    // console.log('onDragMove');
    if (!this.isMoving) return;

    const dims = e.touches ? e.touches[0] : e;

    this.placeholderEl.style.width = `${this.snap(dims.clientX - this.startX)}px`;
    this.placeholderEl.style.height = `${this.snap(dims.clientY - this.startY)}px`;
  }

  onDragEnd() {
    // const dims = e.touches ? e.touches[0] : e;
    this.isMoving = false;

    const relativeDims = this.getRelativeDims(this.placeholderEl);

    const moreThanGridWide = relativeDims.width >= GRID_SIZE;
    const moreThanGridHight = relativeDims.height >= GRID_SIZE;
    const moreThanAClick = performance.now() - this.dragStartTime > CLICK_LENGTH_MS;

    if (moreThanAClick && (moreThanGridWide || moreThanGridHight)) {
      this.addBox(relativeDims);
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
      top: childDims.top - parentDims.top,
      left: childDims.left - parentDims.left,
      width: childDims.width,
      height: childDims.height,
    };
  }

  addBox(dims) {
    const newBoxes = this.state.boxes.slice();

    const box = {
      ...dims,
      id: getGuid(),
      name: `Box number ${newBoxes.length}`,
    };

    newBoxes.push(box);

    this.setState({boxes: newBoxes});
  }

  snap(num) {
    return Math.ceil(num / GRID_SIZE) * GRID_SIZE;
  }

  selectBox(boxId) {
    const newBoxes = this.state.boxes.map(box => {
      const isSelected = box.id === boxId;

      return {
        ...box,
        selected: isSelected,
      };
    });

    this.setState({boxes: newBoxes});
  }

  render() {
    const boxEls = this.state.boxes.map(box => (
      <Box
        key={box.id}
        box={box}
        selectBox={this.selectBox}
      />
    ));

    return (
      <div
        ref={el => this.screenEl = el}
        style={styles.main}
        onMouseDown={this.onDragStart}
        onTouchStart={this.onDragStart}
      >
        {boxEls}

        <div
          ref={el => this.placeholderEl = el}
          style={this.placeholderStyle}
        ></div>
      </div>
    );
  }
}

export default Radium(Screen);
