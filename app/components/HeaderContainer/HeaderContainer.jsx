import {connect} from 'react-redux';

import * as actionCreators from '../../data/actionCreators.js';
import Header from './Header/Header.jsx';

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showModal: modal => {
      dispatch(actionCreators.showModal(modal));
    },
    signIn: provider => {
      actionCreators.signIn(provider);
    },
    signOut: () => {
      actionCreators.signOut();
    },
  };
};

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);

export default HeaderContainer;
