import {connect} from 'react-redux';

import * as actions from '../../data/actions.js';
import BoxList from './BoxList/BoxList.jsx';

const mapStateToProps = state => {
  return {
    boxes: state.boxes,
    activeBox: state.activeBox,
    currentTool: state.currentTool,
    currentScreenKey: state.currentScreenKey,
  }
};

const mapDispatchToProps = () => {
  return {
    boxActions: {
      update: (id, newProps) => {
        actions.updateBox(id, newProps);
      },
      remove: id => {
        actions.removeBox(id);
      },
      setActiveBox: (id, mode) => {
        actions.setActiveBox(id, mode);
      },
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoxList);
