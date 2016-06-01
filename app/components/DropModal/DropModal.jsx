import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';
import {connect} from 'react-redux';

import ToolDropModal from './ToolDropModal/ToolDropModal.jsx';

import {
  COLORS,
  DROP_MODALS,
  Z_INDEXES,
} from '../../constants.js';

const styles = {
  back: {
    position: 'fixed',
    padding: 8,
    textAlign: 'center',
    color: COLORS.WHITE,
    background: COLORS.GRAY_DARK,
    zIndex: Z_INDEXES.DROP_MODAL,
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

const DropModal = props => {
  let Child;

  switch (props.currentDropModal) {
    case DROP_MODALS.NONE:
      return null;

    case DROP_MODALS.TEXT:
    case DROP_MODALS.LABEL:
      Child = ToolDropModal;
      break;

    default:
      return null;
  }

  return (
    <Child
      currentDropModal={props.currentDropModal}
      styles={styles}
      triangle={<div style={styles.triangle}>▲</div>}
    />
  );
};

DropModal.propTypes = {
  currentDropModal: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  return {
    currentDropModal: state.currentDropModal,
  };
};

export default connect(mapStateToProps)(Radium(DropModal));
