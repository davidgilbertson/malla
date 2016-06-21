import React from 'react';
const {PropTypes} = React;
import {connect} from 'react-redux';

import {
  DROP_MODALS,
  ITEM_TYPES,
} from '../../constants.js';
import * as actions from '../../data/actions.js';

import ToolDropModal from './ToolDropModal/ToolDropModal.jsx';
import ScreenOrProjectSelector from './ScreenOrProjectSelector/ScreenOrProjectSelector.jsx';
import BoxActions from './BoxActions/BoxActions.jsx';

const DropModalConductor = props => {
  switch (props.currentDropModal) {
    case DROP_MODALS.TEXT:
    case DROP_MODALS.LABEL:
      return <ToolDropModal {...props} />;

    case DROP_MODALS.PROJECT_SELECTOR:
      return <ScreenOrProjectSelector {...props} itemType={ITEM_TYPES.PROJECT} />;

    case DROP_MODALS.SCREEN_SELECTOR:
      return <ScreenOrProjectSelector {...props} itemType={ITEM_TYPES.SCREEN} />;

    case DROP_MODALS.BOX_ACTIONS:
      return <BoxActions {...props} />;

    default:
      return null;
  }
};

DropModalConductor.propTypes = {
  currentDropModal: PropTypes.string.isRequired,
};

export default connect(state => state, () => actions)(DropModalConductor);
