import {connect} from 'react-redux';

import * as boxActions from '../../data/actionCreators.js';
import Screen from '../Screen/Screen.jsx';

const mapDispatchToProps = dispatch => {
  return {
    boxActions: {
      add: id => {
        dispatch(boxActions.add(id));
      },
      select: id => {
        dispatch(boxActions.select(id));
      },
    },
  };
};

const ScreenContainer = connect(null, mapDispatchToProps)(Screen);

export default ScreenContainer;
