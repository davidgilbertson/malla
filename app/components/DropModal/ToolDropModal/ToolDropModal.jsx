import React from 'react';
const {PropTypes} = React;

import DropModalWrapper from '../DropModalWrapper.jsx';

import {
  ELEMENT_IDS,
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

  return (
    <DropModalWrapper
      {...props}
      centerOnElementId={anchorElId}
    >
      {body}
    </DropModalWrapper>
  )
};

ToolDropModal.propTypes = {
  // props
  currentDropModal: PropTypes.string.isRequired,
};

export default ToolDropModal;
