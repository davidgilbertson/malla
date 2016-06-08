import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import ToolDropModal from './ToolDropModal/ToolDropModal.jsx';
import ScreenSelector from './ScreenSelector/ScreenSelector.jsx';
import BoxActions from './BoxActions/BoxActions.jsx';

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
    position: 'absolute',
    padding: 8,
    textAlign: 'center',
    color: COLORS.WHITE,
    backgroundColor: COLORS.GRAY_DARK,
    transform: 'translateX(-50%)',
    width: DIMENSIONS.SPACE_L * 4,
    zIndex: Z_INDEXES.DROP_MODAL,
    ...css.shadow('small'),
  },
  triangle: {
    position: 'absolute',
    top: -18,
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

    case DROP_MODALS.BOX_ACTIONS:
      Child = BoxActions;
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

export default Radium(DropModal);
