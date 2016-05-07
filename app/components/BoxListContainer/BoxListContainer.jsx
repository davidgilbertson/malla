import {connect} from 'react-redux';

import * as boxActions from '../../data/actionCreators.js';
import BoxList from './BoxList/BoxList.jsx';

const mapStateToProps = state => {
  return {
    boxes: state.boxes,
    activeBox: state.activeBox,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    boxActions: {
      update: (id, newProps) => {
        boxActions.update(id, newProps);
      },
      remove: id => {
        boxActions.remove(id);
      },
      setActiveBox: (id, mode) => {
        dispatch(boxActions.setActiveBox(id, mode));
      },
    }
  };
};

const BoxListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BoxList);

export default BoxListContainer;
