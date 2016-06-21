import {connect} from 'react-redux';

import * as actions from '../../data/actions.js';
import BoxList from './BoxList/BoxList.jsx';

const mapStateToProps = state => ({
  boxes: state.boxes,
  activeBox: state.activeBox,
  currentTool: state.currentTool,
  currentScreenKey: state.currentScreenKey,
});

const mapDispatchToProps = () => ({
  boxActions: {
    update: (id, newProps) => {
      actions.updateBox(id, newProps);
    },
    remove: id => {
      actions.removeBox(id);
    },
    setActiveBox: actions.setActiveBox,
  },
  showModal: actions.showModal,
});

export default connect(mapStateToProps, mapDispatchToProps)(BoxList);
