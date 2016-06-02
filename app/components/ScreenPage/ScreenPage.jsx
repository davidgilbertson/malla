import {connect} from 'react-redux';

import * as actions from '../../data/actions.js';
import Screen from './Screen/Screen.jsx';
import {
  BOX_MODES,
} from '../../constants.js';

const mapStateToProps = state  => {
  return {
    user: state.user,
    currentTool: state.currentTool,
    currentScreenKey: state.currentScreenKey,
    screens: state.screens,
    projects: state.projects,
  };
};

const mapDispatchToProps = () => {
  return {
    boxActions: {
      add: box => {
        const newBoxId = actions.addBox(box);

        actions.setActiveBox(newBoxId, BOX_MODES.TYPING);
      },
      setActiveBox: (id, mode) => {
        actions.setActiveBox(id, mode);
      },
    },
    showModal: modal => {
      actions.showModal(modal);
    },
    showDropModal: dropModal => {
      actions.showDropModal(dropModal);
    },
    selectTool: tool => {
      actions.selectTool(tool);
    },
    navigateToScreen: key => {
      actions.navigateToScreen(key);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Screen);
