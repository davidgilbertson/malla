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
      setActiveBox: actions.setActiveBox,
    },
    showModal: actions.showModal,
    showDropModal: actions.showDropModal,
    selectTool: actions.selectTool,
    navigateToScreen: actions.navigateToScreen,
    navigateToProject: actions.navigateToProject,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Screen);
