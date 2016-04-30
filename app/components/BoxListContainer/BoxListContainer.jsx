import {connect} from 'react-redux';

import addBox from '../../data/actionCreatros/addBox.js';
import selectBox from '../../data/actionCreatros/selectBox.js';
import BoxList from '../BoxList/BoxList.jsx';

const mapStateToProps = (state) => {
  return {
    boxes: state.boxes
  }
};

const mapDispatchToProps = dispatch => {
  return {
    addBox: id => {
      dispatch(addBox(id));
    },
    selectBox: id => {
      dispatch(selectBox(id));
    },
  };
};

const BoxListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BoxList);

export default BoxListContainer;
