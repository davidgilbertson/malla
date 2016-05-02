import {connect} from 'react-redux';

import * as boxActions from '../../data/actionCreators.js';
import Screen from '../Screen/Screen.jsx';

const mapDispatchToProps = dispatch => {
  return {
    boxActions: {
      add: box => {
        dispatch(boxActions.add(box));
      },
      select: id => {
        dispatch(boxActions.select(id));
      },
      setMode: (id, mode) => {
        dispatch(boxActions.setMode(id, mode));
      },
    },
  };
};

const ScreenContainer = connect(null, mapDispatchToProps)(Screen);

export default ScreenContainer;
