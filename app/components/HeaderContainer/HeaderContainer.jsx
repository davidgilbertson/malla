import {connect} from 'react-redux';

import * as actions from '../../data/actions.js';
import Header from './Header/Header.jsx';

const mapStateToProps = state => {
  return {
    user: state.user,
    projects: state.projects,
    screens: state.screens,
  };
};

const mapDispatchToProps = () => {
  return {
    showModal: modal => {
      actions.showModal(modal);
    },
    updateUser: (newProps) => {
      actions.updateUser(newProps);
    },
    signOut: () => {
      actions.signOut();
    },
    navigateToScreen: key => {
      actions.navigateToScreen(key);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
