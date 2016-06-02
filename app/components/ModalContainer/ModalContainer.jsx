import {connect} from 'react-redux';

import * as actions from '../../data/actions.js';
import ModalWrapper from './ModalWrapper/ModalWrapper.jsx';

const mapDispatchToProps = () => {
  return {
    hideModal: modal => {
      actions.hideModal(modal);
    },
    signIn: provider => {
      actions.signIn(provider);
    },
    setInteraction: interaction => {
      actions.setInteraction(interaction);
    },
    sendFeedback: feedback => {
      actions.sendFeedback(feedback);
    },
    addScreen: screen => {
      actions.addScreen(screen);
    },
    updateScreen: (key, val) => {
      actions.updateScreen(key, val);
    },
    removeScreen: key => {
      actions.removeScreen(key);
    },
  };
};

export default connect(state => state, mapDispatchToProps)(ModalWrapper);
