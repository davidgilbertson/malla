import {connect} from 'react-redux';

import * as actionCreators from '../../data/actionCreators.js';
import Screen from './Screen/Screen.jsx';
import {
  BOX_MODES,
} from '../../constants.js';

const mapStateToProps = state  => {
  return {
    user: state.user,
    currentTool: state.currentTool,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    boxActions: {
      add: box => {
        const newBoxId = actionCreators.addBox(box);

        dispatch(actionCreators.setActiveBox(newBoxId, BOX_MODES.TYPING));
      },
      setActiveBox: (id, mode) => {
        dispatch(actionCreators.setActiveBox(id, mode));
      },
    },
    showModal: modal => {
      dispatch(actionCreators.showModal(modal));
    },
    showDropModal: dropModal => {
      dispatch(actionCreators.showDropModal(dropModal));
    },
    selectTool: tool => {
      dispatch(actionCreators.selectTool(tool));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Screen);
