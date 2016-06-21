import {connect} from 'react-redux';

import * as actions from '../../data/actions.js';
import Header from './Header/Header.jsx';

const mapStateToProps = state => ({
  user: state.user,
  projects: state.projects,
  screens: state.screens,
});

const mapDispatchToProps = () => ({
  showModal: actions.showModal,
  updateUser: actions.updateUser,
  signOut: actions.signOut,
  navigateToScreen: actions.navigateToScreen,
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
