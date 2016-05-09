import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';
import {Link, browserHistory} from 'react-router';
import cloneDeep from 'lodash/cloneDeep';

import {
  BREAKPOINTS,
  COLORS,
  DIMENSIONS,
  MODALS,
  SIGN_IN_STATUSES,
} from '../../../constants.js';

import {
  css,
} from '../../../utils.js';

const HEIGHT = DIMENSIONS.LAYOUT.HEADER_HEIGHT;
const GUTTER = 6;

const baseStyles = {
  header: {
    position: 'absolute',
    width: '100%',
    height: DIMENSIONS.LAYOUT.HEADER_HEIGHT,
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
  },
  homePageHeaderButton: {
    margin: '15px 15px 15px 0',
    fontWeight: 400,
    [BREAKPOINTS.TABLET_PORTRAIT]: {
      padding: '10px 20px',
      minWidth: '120px',
    },
  },
  headerSecondaryButton: {
    textDecoration: 'underline',
    [BREAKPOINTS.PHONE_ONLY]: {
      textTransform: 'none',
    },
    [BREAKPOINTS.TABLET_PORTRAIT]: {
      textDecoration: 'none',
      border: `1px solid ${COLORS.WHITE}`,
    },
  },
  headerPrimaryButton: {
    [BREAKPOINTS.PHONE_ONLY]: {
      display: 'none',
    },
    [BREAKPOINTS.TABLET_PORTRAIT]: {
      background: COLORS.WHITE,
      color: COLORS.PRIMARY_DARK,
      ...css.shadow('light'),
    },
  },
};


const Header = ({user, showModal, signOut, location, projects}) => {
  const styles = cloneDeep(baseStyles);

  const actionItems = {
    signInButton: (
      <button
        key="signInButton"
        style={[styles.homePageHeaderButton, styles.headerSecondaryButton]}
        onClick={() => {
          showModal(MODALS.SOCIAL_SIGN_IN);
        }}
      >
        Sign in
      </button>
    ),
    signUpButton: (
      <button
        key="signUpButton"
        style={[styles.homePageHeaderButton, styles.headerPrimaryButton]}
        onClick={() => {
          showModal(MODALS.SOCIAL_SIGN_IN);
        }}
      >
        Sign up
      </button>
    ),
    signOutButton: (
      <button
        key="signOutButton"
        style={styles.signInOrOutButton}
        onClick={signOut}
      >Sign out</button>
    ),
    myProjects: (
      <button
        key="myProjects"
        style={[styles.homePageHeaderButton, styles.headerSecondaryButton]}
        onClick={() => {
          const firstProjectId = Object.keys(projects)[0];

          browserHistory.push(`/project/my-project/${firstProjectId}`);
        }}
      >My projects</button>
    ),
    exportData: (
      <button
        key="exportData"
        style={styles.headerButton}
        onClick={() => {
          showModal(MODALS.EXPORT_DATA)
        }}
      >Preview the API results</button>
    ),
  };

  const atHome = location && location.pathname === '/';
  const signedIn = user.signInStatus === SIGN_IN_STATUSES.SIGNED_IN;

  const actionItemElements = [];
  let homeLink = null;

  if (atHome) {
    styles.header.backgroundColor = 'transparent';
    styles.header.height = DIMENSIONS.LAYOUT.HEADER_HEIGHT_HOME;

    if (signedIn) {
      actionItemElements.push(actionItems.myProjects);
    } else {
      actionItemElements.push(actionItems.signInButton);
      actionItemElements.push(actionItems.signUpButton);
    }
  } else {
    actionItemElements.push(actionItems.exportData);

    homeLink = (
      <h1 style={styles.title}>
        <Link to="/">Malla</Link>
      </h1>
    );
  }

  if (signedIn) {
    actionItemElements.push(actionItems.signOutButton);
  }

  return (
    <header style={styles.header}>
      <div>
        {homeLink}
      </div>

      <div>
        {actionItemElements}
      </div>
    </header>
  );
};

Header.propTypes = {
  // state
  user: PropTypes.object.isRequired,
  // actions
  showModal: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
};

export default Radium(Header);
