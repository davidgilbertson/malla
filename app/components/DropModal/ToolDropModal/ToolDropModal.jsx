import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import {
  ELEMENT_IDS,
  DIMENSIONS,
  DROP_MODALS,
} from '../../../constants.js';

import {
  css,
} from '../../../utils';

const ToolDropModal = props => {
  let body = null;
  let anchorEl;

  const styles = {
    back: {
      width: DIMENSIONS.SPACE_L * 4,
      ...css.shadow('small'),
    }
  };

  if (props.currentDropModal === DROP_MODALS.TEXT) {
    body = <div>Add text that you want to use in your website or app</div>;
    anchorEl = document.getElementById(`${ELEMENT_IDS.TEXT_TOOL}`);
  }

  if (props.currentDropModal === DROP_MODALS.LABEL) {
    body = <div>Add labels that are only visible in Malla</div>;
    anchorEl = document.getElementById(`${ELEMENT_IDS.LABEL_TOOL}`);
  }

  const anchorDims = anchorEl.getBoundingClientRect();
  styles.back.left = anchorDims.left + anchorDims.width / 2 - styles.back.width / 2;
  styles.back.top = anchorDims.top + anchorDims.height + 13;

  return (
    <div
      style={[props.styles.back, styles.back]}
    >
      {props.triangle}
      {body}
    </div>
  )
};

ToolDropModal.propTypes = {
  currentDropModal: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
  triangle: PropTypes.object,
};

export default Radium(ToolDropModal);
