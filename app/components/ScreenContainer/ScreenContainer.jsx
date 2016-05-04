import {connect} from 'react-redux';

import * as actionCreators from '../../data/actionCreators.js';
import Screen from './Screen/Screen.jsx';

const mapDispatchToProps = dispatch => {
  return {
    boxActions: {
      add: box => {
        dispatch(actionCreators.add(box));
      },
      setMode: (id, mode) => {
        dispatch(actionCreators.setMode(id, mode));
      },
    },
    hideModal: () => {
      dispatch(actionCreators.hideModal());
    },
  };
};

const ScreenContainer = connect(null, mapDispatchToProps)(Screen);

export default ScreenContainer;
