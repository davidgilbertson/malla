import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';
import {connect} from 'react-redux';

import ToolDropModal from './ToolDropModal/ToolDropModal.jsx';
import ScreenSelector from './ScreenSelector/ScreenSelector.jsx';

import * as actionCreators from '../../data/actionCreators.js';

import {
  COLORS,
  DIMENSIONS,
  DROP_MODALS,
  Z_INDEXES,
} from '../../constants.js';

import {
  css,
} from '../../utils';

const styles = {
  back: {
    position: 'fixed',
    padding: 8,
    textAlign: 'center',
    color: COLORS.WHITE,
    background: COLORS.GRAY_DARK,
    transform: 'translateX(-50%)',
    width: DIMENSIONS.SPACE_L * 4,
    zIndex: Z_INDEXES.DROP_MODAL,
    ...css.shadow('small'),
  },
  triangle: {
    position: 'absolute',
    top: -20,
    width: 20,
    height: 20,
    transform: 'translateX(-50%)',
    fontSize: 20,
    color: COLORS.GRAY_DARK,
    left: '50%',
  }
};

function getCoordinates(elementId) {
  const anchorEl = document.getElementById(elementId);
  
  if (!anchorEl) {
    console.warn(`Element with id ${elementId} does not exist`);
    return {};
  }

  const anchorDims = anchorEl.getBoundingClientRect();

  return {
    left: Math.max(0, anchorDims.left + anchorDims.width / 2),
    top: anchorDims.top + anchorDims.height + 13,
  };
}

const DropModal = props => {
  let Child;

  switch (props.currentDropModal) {
    case DROP_MODALS.NONE:
      return null;

    case DROP_MODALS.TEXT:
    case DROP_MODALS.LABEL:
      Child = ToolDropModal;
      break;

    case DROP_MODALS.SCREEN_SELECTOR:
      Child = ScreenSelector;
      break;

    default:
      return null;
  }

  return (
    <Child
      {...props}
      styles={styles}
      getCoordinates={getCoordinates}
      triangle={<div style={styles.triangle}>▲</div>}
    />
  );
};

DropModal.propTypes = {
  // state
  currentDropModal: PropTypes.string.isRequired,
};

const mapDispatchToProps = dispatch => {
  return {
    navigateToScreen: key => {
      actionCreators.navigateToScreen(key);
    },
    showModal: modal => {
      dispatch(actionCreators.showModal(modal));
    },
  };
};

export default connect(state => state, mapDispatchToProps)(Radium(DropModal));
