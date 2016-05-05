import {connect} from 'react-redux';

import * as actionCreators from '../../data/actionCreators.js';
import Screen from './Screen/Screen.jsx';
import {
  BOX_MODES,
} from '../../constants.js';

const mapDispatchToProps = dispatch => {
  return {
    boxActions: {
      add: box => {
        const newBoxId = actionCreators.add(box);
        dispatch(actionCreators.setActiveBox(newBoxId, BOX_MODES.TYPING));
      },
      setActiveBox: (id, mode) => {
        dispatch(actionCreators.setActiveBox(id, mode));
      },
    },
    hideModal: () => {
      dispatch(actionCreators.hideModal());
    },
  };
};

const ScreenContainer = connect(null, mapDispatchToProps)(Screen);

export default ScreenContainer;
