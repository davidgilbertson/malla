import {connect} from 'react-redux';

import * as actionCreators from '../../data/actionCreators.js';
import Project from './Project/Project.jsx';
import {
  BOX_MODES,
} from '../../constants.js';

const mapStateToProps = state  => {
  return {
    user: state.user,
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
    hideModal: () => {
      dispatch(actionCreators.hideModal());
    },
    showModal: () => {
      dispatch(actionCreators.showModal());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Project);
