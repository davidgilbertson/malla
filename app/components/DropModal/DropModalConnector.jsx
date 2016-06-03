import React from 'react';
import {connect} from 'react-redux';

import DropModal from './DropModal.jsx';
import * as actions from '../../data/actions.js';

const mapDispatchToProps = () => {
  return {
    navigateToScreen: key => {
      actions.navigateToScreen(key);
    },
    showModal: modal => {
      actions.showModal(modal);
    },
  };
};

export default connect(state => state, mapDispatchToProps)(DropModal);
