import {connect} from 'react-redux';

import * as boxActions from '../../data/actionCreators.js';
import BoxList from '../BoxList/BoxList.jsx';

const mapStateToProps = (state) => {
  return {
    boxes: state.boxes
  }
};

const mapDispatchToProps = dispatch => {
  return {
    boxActions: {
      select: id => {
        dispatch(boxActions.select(id));
      },
      update: (id, newProps) => {
        dispatch(boxActions.update(id, newProps));
      },
      remove: id => {
        dispatch(boxActions.remove(id));
      },
      setMode: (id, mode) => {
        dispatch(boxActions.setMode(id, mode));
      },
    }
  };
};

const BoxListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BoxList);

export default BoxListContainer;
