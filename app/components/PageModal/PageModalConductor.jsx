import React from 'react';
const {PropTypes} = React;
import {connect} from 'react-redux';

import * as actions from '../../data/actions.js';

import ExportDataModal from './ExportDataModal/ExportDataModal.jsx';
import SignInModal from './SignInModal/SignInModal.jsx';
import FeedbackModal from './FeedbackModal/FeedbackModal.jsx';
import ScreenDetails from './ScreenDetails/ScreenDetails.jsx';
import BoxDetails from './BoxDetails/BoxDetails.jsx';

import {
  MODALS,
} from '../../constants.js';

const PageModalConductor = props => {
  let ModalBody;
  let extraProps = {};

  switch (props.currentModal) {
    case MODALS.EXPORT_DATA :
      ModalBody = ExportDataModal;
      break;

    case MODALS.SOCIAL_SIGN_IN :
      ModalBody = SignInModal;
      break;

    case MODALS.FEEDBACK :
      ModalBody = FeedbackModal;
      break;

    case MODALS.ADD_SCREEN :
      ModalBody = ScreenDetails;
      extraProps.mode = 'add';
      break;

    case MODALS.EDIT_SCREEN :
      ModalBody = ScreenDetails;
      extraProps.mode = 'edit';
      break;

    case MODALS.EDIT_BOX :
      ModalBody = BoxDetails;
      break;

    default :
      return null;
  }

  return (
    <ModalBody
      {...props}
      {...extraProps}
    />
  );
};

PageModalConductor.propTypes = {
  currentModal: PropTypes.string.isRequired,
};

export default connect(state => state, () => actions)(PageModalConductor);
