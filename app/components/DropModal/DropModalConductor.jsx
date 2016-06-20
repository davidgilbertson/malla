import React from 'react';
const {PropTypes} = React;
import {connect} from 'react-redux';

import {
  DROP_MODALS,
} from '../../constants.js';
import * as actions from '../../data/actions.js';

import ToolDropModal from './ToolDropModal/ToolDropModal.jsx';
import ScreenSelector from './ScreenSelector/ScreenSelector.jsx';
import BoxActions from './BoxActions/BoxActions.jsx';

const DropModalConductor = props => {
  switch (props.currentDropModal) {
    case DROP_MODALS.TEXT:
    case DROP_MODALS.LABEL:
      return <ToolDropModal {...props}/>;

    case DROP_MODALS.SCREEN_SELECTOR:
      return <ScreenSelector {...props}/>;

    case DROP_MODALS.BOX_ACTIONS:
      return <BoxActions {...props}/>;

    default:
      return null;
  }
};

DropModalConductor.propTypes = {
  currentDropModal: PropTypes.string.isRequired,
};

export default connect(state => state, () => actions)(DropModalConductor);
