import React from 'react';

import {MODALS} from '../../../constants.js';
import ExportDataModal from './ExportDataModal/ExportDataModal.jsx';
import SignInModal from './SignInModal/SignInModal.jsx';
import FeedbackModal from './FeedbackModal/FeedbackModal.jsx';
import ScreenDetails from './ScreenDetails/ScreenDetails.jsx';
import BoxDetails from './BoxDetails/BoxDetails.jsx';

const ModalWrapper = (props) => {
  switch (props.currentModal) {
    case MODALS.EXPORT_DATA :
      return <ExportDataModal {...props}/>;
    
    case MODALS.SOCIAL_SIGN_IN :
      return <SignInModal {...props}/>;
    
    case MODALS.FEEDBACK :
      return <FeedbackModal {...props}/>;
    
    case MODALS.EDIT_SCREEN :
      return <ScreenDetails {...props} mode="edit"/>;

    case MODALS.ADD_SCREEN :
      return <ScreenDetails {...props} mode="add"/>;

    case MODALS.EDIT_BOX :
      return <BoxDetails {...props}/>;

    default :
      return null;
  }
};

export default ModalWrapper;
