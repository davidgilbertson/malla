import {connect} from 'react-redux';

import * as actionCreators from '../../data/actionCreators.js';
import BoxList from './BoxList/BoxList.jsx';

const mapStateToProps = state => {
  return {
    boxes: state.boxes,
    activeBox: state.activeBox,
    currentTool: state.currentTool,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    boxActions: {
      update: (id, newProps) => {
        actionCreators.updateBox(id, newProps);
      },
      remove: id => {
        actionCreators.removeBox(id);
      },
      setActiveBox: (id, mode) => {
        dispatch(actionCreators.setActiveBox(id, mode));
      },
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoxList);
