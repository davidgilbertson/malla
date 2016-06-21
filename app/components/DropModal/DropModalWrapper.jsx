import React from 'react';
const {Component, PropTypes} = React;

import {
  COLORS,
  DIMENSIONS,
  Z_INDEXES,
} from '../../constants.js';

import {
  css,
} from '../../utils';

const baseModalStyle = {
  position: 'absolute',
  padding: 8,
  textAlign: 'center',
  color: COLORS.WHITE,
  backgroundColor: COLORS.GRAY_DARK,
  transform: 'translateX(-50%)',
  width: DIMENSIONS.SPACE_L * 4,
  maxWidth: '100vw',
  zIndex: Z_INDEXES.DROP_MODAL,
  ...css.shadow('small'),
};

class DropModalWrapper extends Component {
  constructor(props) {
    super(props);
    this.onAnyClick = this.onAnyClick.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false);

    if (this.props.hideOnAnyClick) {
      // 'mousedown' because 'click' would trigger immediately and close the modal when it opens
      window.addEventListener('mousedown', this.onAnyClick, false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize, false);

    if (this.props.hideOnAnyClick) {
      window.removeEventListener('mousedown', this.onAnyClick, false);
    }
  }

  onAnyClick(e) {
    // if a click occurs outside this modal
    if (!this.el.contains(e.target)) {
      this.props.hideDropModal();
    }
  }

  onResize() {
    this.forceUpdate();
  }

  render() {
    const {props} = this;
    const modalStyle = {
      ...baseModalStyle,
      ...props.modalStyle,
    };

    const triangleStyle = {
      position: 'absolute',
      top: -18,
      width: 20,
      height: 20,
      transform: 'translateX(-50%)',
      fontSize: 20,
      color: COLORS.GRAY_DARK,
      left: '50%',
    };

    if (props.centerOnElementId) {
      const anchorEl = document.getElementById(props.centerOnElementId);

      if (!anchorEl) {
        console.warn(`Element with id ${props.centerOnElementId} does not exist`);
      } else {
        const anchorDims = anchorEl.getBoundingClientRect();

        const minimumAllowedLeft = modalStyle.width / 2 + 10; // half the width plus a little gap off the side of the screen
        const preliminaryLeft = anchorDims.left + anchorDims.width / 2;
        let shiftRight = 0;

        if (preliminaryLeft < minimumAllowedLeft) {
          // if we need to shift the drop down right, adjust the triangle left so it stays aligned to the reference element
          shiftRight = minimumAllowedLeft - preliminaryLeft;
          triangleStyle.left = `${50 - (shiftRight / modalStyle.width) * 100}%`;
        }

        modalStyle.left = Math.max(minimumAllowedLeft, preliminaryLeft);
        modalStyle.top = anchorDims.top + anchorDims.height + 13;
      }
    }

    return (
      <div
        ref={el => this.el = el}
        style={modalStyle}
      >
        <div style={triangleStyle}>▲</div>

        {props.children}
      </div>
    );
  }
}

DropModalWrapper.propTypes = {
  // props
  centerOnElementId: PropTypes.string,
  centerOnElement: PropTypes.bool,
  modalStyle: PropTypes.object,
  hideOnAnyClick: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,

  // functions
  hideDropModal: PropTypes.func,
};

DropModalWrapper.defaultProps = {
  hideOnAnyClick: false,
  hideDropModal: () => {},
};

export default DropModalWrapper;
