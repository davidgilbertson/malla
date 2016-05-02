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
      add: id => {
        dispatch(boxActions.add(id));
      },
      select: id => {
        dispatch(boxActions.select(id));
      },
      update: (id, newProps) => {
        dispatch(boxActions.update(id, newProps));
      },
      remove: id => {
        dispatch(boxActions.remove(id));
      },
    }
  };
};

const BoxListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BoxList);

export default BoxListContainer;
