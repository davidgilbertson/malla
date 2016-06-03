import {connect} from 'react-redux';

import * as actions from '../../data/actions.js';
import ModalWrapper from './ModalWrapper/ModalWrapper.jsx';

const mapDispatchToProps = () => {
  return {
    hideModal: () => {
      actions.hideModal();
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
    updateBox: (key, val) => {
      actions.updateBox(key, val);
    },
    removeBox: key => {
      actions.removeBox(key);
    },
    setActiveBox: (id, mode) => {
      actions.setActiveBox(id, mode);
    },
  };
};

export default connect(state => state, mapDispatchToProps)(ModalWrapper);
