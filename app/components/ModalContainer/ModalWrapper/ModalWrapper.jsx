import React from 'react';
const {PropTypes} = React;

import {MODALS} from '../../../constants.js';
import ExportDataModal from './ExportDataModal/ExportDataModal.jsx';

const ModalWrapper = (props) => {
  switch (props.modal) {
    case MODALS.EXPORT_DATA :
      return <ExportDataModal {...props}/>;
    default :
      return null;
  }
};

ModalWrapper.propTypes = {
  modal: PropTypes.string.isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default ModalWrapper;
