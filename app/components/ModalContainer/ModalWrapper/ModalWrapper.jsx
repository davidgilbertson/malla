import React from 'react';
const {PropTypes} = React;

import {MODALS} from '../../../constants.js';
import ExportDataModal from './ExportDataModal/ExportDataModal.jsx';
import SignInModal from './SignInModal/SignInModal.jsx';

const ModalWrapper = (props) => {
  switch (props.modal) {
    case MODALS.EXPORT_DATA :
      return <ExportDataModal {...props}/>;
    case MODALS.SOCIAL_SIGN_IN :
      return <SignInModal {...props}/>;
    default :
      return null;
  }
};

ModalWrapper.propTypes = {
  modal: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default ModalWrapper;
