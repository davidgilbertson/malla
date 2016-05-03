import {connect} from 'react-redux';

import * as actions from '../../data/actionCreators.js';
import Header from './Header/Header.jsx';

const mapDispatchToProps = dispatch => {
  return {
    showModal: modal => {
      dispatch(actions.showModal(modal));
    },
  };
};

const HeaderContainer = connect(null, mapDispatchToProps)(Header);

export default HeaderContainer;
