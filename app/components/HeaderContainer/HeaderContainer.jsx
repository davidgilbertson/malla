import {connect} from 'react-redux';

import * as actionCreators from '../../data/actionCreators.js';
import Header from './Header/Header.jsx';

const mapStateToProps = state => {
  return {
    user: state.user,
    projects: state.projects,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showModal: modal => {
      dispatch(actionCreators.showModal(modal));
    },
    updateUser: (userId, newProps) => {
      actionCreators.updateUser(userId, newProps);
    },
    signOut: () => {
      actionCreators.signOut();
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
