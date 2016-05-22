import {connect} from 'react-redux';

import * as actionCreators from '../../data/actionCreators.js';
import Header from './Header/Header.jsx';

const mapStateToProps = state => {
  return {
    user: state.user,
    projects: state.projects,
    screens: state.screens,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showModal: modal => {
      dispatch(actionCreators.showModal(modal));
    },
    updateUser: (newProps) => {
      actionCreators.updateUser(newProps);
    },
    signOut: () => {
      actionCreators.signOut();
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
