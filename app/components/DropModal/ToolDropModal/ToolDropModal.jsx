import React from 'react';
const {PropTypes} = React;

import {
  ELEMENT_IDS,
  DIMENSIONS,
  DROP_MODALS,
} from '../../../constants.js';

const ToolDropModal = props => {
  let body = null;
  let anchorElId;

  if (props.currentDropModal === DROP_MODALS.TEXT) {
    body = <div>Add text that you want to use in your website or app</div>;
    anchorElId = ELEMENT_IDS.TEXT_TOOL;
  }

  if (props.currentDropModal === DROP_MODALS.LABEL) {
    body = <div>Add labels that are only visible in Malla</div>;
    anchorElId = ELEMENT_IDS.LABEL_TOOL;
  }

  const coordinates = props.getCoordinates(anchorElId);

  const styles = {
    back: {
      ...props.styles.back,
      ...coordinates,
      width: DIMENSIONS.SPACE_L * 4,
    }
  };

  return (
    <div style={styles.back}>
      {props.triangle}
      {body}
    </div>
  )
};

ToolDropModal.propTypes = {
  // props
  currentDropModal: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
  triangle: PropTypes.object,

  // methods
  getCoordinates: PropTypes.func.isRequired,
};

export default ToolDropModal;
