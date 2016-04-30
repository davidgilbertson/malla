import {connect} from 'react-redux';

import addBox from '../../data/actionCreatros/addBox.js';
import selectBox from '../../data/actionCreatros/selectBox.js';
import Screen from '../Screen/Screen.jsx';

const mapDispatchToProps = dispatch => {
  return {
    addBox: box => {
      dispatch(addBox(box));
    },
    selectBox: id => {
      dispatch(selectBox(id));
    },
  };
};

const ScreenContainer = connect(null, mapDispatchToProps)(Screen);

export default ScreenContainer;
