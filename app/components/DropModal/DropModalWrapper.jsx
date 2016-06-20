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

class DropModalWrapper extends Component {
  constructor(props) {
    super(props);
    this.onAnyClick = this.onAnyClick.bind(this);
  }

  onAnyClick(e) {
    // if a click occurs outside this modal
    if (!this.el.contains(e.target)) {
      this.props.hideDropModal();
    }
  }

  componentDidMount() {
    if (this.props.hideOnAnyClick) {
      // 'mousedown' because 'click' would trigger immediately.
      window.addEventListener('mousedown', this.onAnyClick, false);
    }
  }

  componentWillUnmount() {
    if (this.props.hideOnAnyClick) {
      window.removeEventListener('mousedown', this.onAnyClick, false);
    }
  }

  render() {
    const {props} = this;
    const modalStyle = {
      ...baseModalStyle,
      ...props.modalStyle,
    };

    if (props.centerOnElementId) {
      const anchorEl = document.getElementById(props.centerOnElementId);

      if (!anchorEl) {
        console.warn(`Element with id ${props.centerOnElementId} does not exist`);
      } else {
        const anchorDims = anchorEl.getBoundingClientRect();

        modalStyle.left = Math.max(0, anchorDims.left + anchorDims.width / 2);
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
