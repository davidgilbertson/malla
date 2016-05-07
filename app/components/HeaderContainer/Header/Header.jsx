import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import {
  COLORS,
  DIMENSIONS,
  MODALS,
  SIGN_IN_STATUSES,
} from '../../../constants.js';

const HEIGHT = DIMENSIONS.LAYOUT.HEADER_HEIGHT;
const GUTTER = 6;

const styles = {
  header: {
    flex: `0 0 ${HEIGHT}px`,
    backgroundColor: COLORS.PRIMARY_DARK,
    textAlign: 'center',
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: COLORS.WHITE,
    padding: `0 ${GUTTER}px`,
  },
  title: {
    fontSize: 24,
  },
  headerButton: {
    height: HEIGHT - (GUTTER * 2),
    color: COLORS.WHITE,
    background: COLORS.PRIMARY,
    padding: '0 8px',
  },
  signInOrOutButton: {
    color: COLORS.WHITE,
  }
};

const Header = ({user, showModal, signIn, signOut}) => {
  const signInOrOutButton = user.signInStatus === SIGN_IN_STATUSES.SIGNED_IN
    ? (
      <span>
        {user.name}
        {' '}
        <button
          style={styles.signInOrOutButton}
          onClick={signOut}
        >Sign out</button>
      </span>
    ) : (
      <button
        style={styles.signInOrOutButton}
        onClick={signIn.bind(null, 'google')}
      >Sign in</button>
    );

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Malla</h1>
      <div>
        {signInOrOutButton}

        <button
          style={styles.headerButton}
          onClick={() => {
          showModal(MODALS.EXPORT_DATA)
        }}
        >Preview the API results</button>
      </div>
    </header>
  );
};

Header.propTypes = {
  // state
  user: PropTypes.object.isRequired,
  // actions
  showModal: PropTypes.func.isRequired,
  signIn: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
};

export default Radium(Header);
