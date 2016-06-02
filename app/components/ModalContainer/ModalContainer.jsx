import {connect} from 'react-redux';

import * as actionCreators from '../../data/actionCreators.js';
import ModalWrapper from './ModalWrapper/ModalWrapper.jsx';

const mapDispatchToProps = dispatch => {
  return {
    hideModal: modal => {
      dispatch(actionCreators.hideModal(modal));
    },
    signIn: provider => {
      actionCreators.signIn(provider);
    },
    setInteraction: interaction => {
      dispatch(actionCreators.setInteraction(interaction));
    },
    sendFeedback: feedback => {
      actionCreators.sendFeedback(feedback);
    },
    addScreen: screen => {
      actionCreators.addScreen(screen);
    },
    updateScreen: (key, val) => {
      actionCreators.updateScreen(key, val);
    },
    removeScreen: key => {
      actionCreators.removeScreen(key);
    },
  };
};

export default connect(state => state, mapDispatchToProps)(ModalWrapper);
