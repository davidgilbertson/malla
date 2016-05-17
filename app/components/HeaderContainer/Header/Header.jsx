import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';
import {Link, browserHistory} from 'react-router';
import cloneDeep from 'lodash/cloneDeep';

import Button from '../../Button/Button.jsx';
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

import {EVENTS} from '../../../tracker.js';

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
    marginRight: 10,
  },
  signInOrOutButton: {
    color: COLORS.WHITE,
  },
  homePageHeaderButton: {
    margin: '15px 15px 15px 0',
    fontWeight: 400,
    padding: '10px 20px',
    [BREAKPOINTS.TABLET_PORTRAIT]: {
      minWidth: '120px',
    },
  },
  headerMinorButton: {
    textDecoration: 'underline',
    textTransform: 'none',
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
    background: COLORS.ACCENT,
    color: COLORS.WHITE,
    ...css.shadow('light'),
  },
};


const Header = ({user, updateUser, showModal, signOut, location, projects}) => {
  const styles = cloneDeep(baseStyles);

  const actionItems = {
    signInButton: (
      <Button
        key="signInButton"
        style={[styles.homePageHeaderButton, styles.headerSecondaryButton]}
        category={EVENTS.CATEGORIES.UI_INTERACTION}
        action={EVENTS.ACTIONS.CLICKED.SIGN_IN}
        label="Header button"
        onClick={() => {
          showModal(MODALS.SOCIAL_SIGN_IN);
        }}
      >
        Sign in
      </Button>
    ),
    signUpButton: (
      <Button
        key="signUpButton"
        style={[styles.homePageHeaderButton, styles.headerPrimaryButton]}
        category={EVENTS.CATEGORIES.UI_INTERACTION}
        action={EVENTS.ACTIONS.CLICKED.SIGN_UP}
        label="Header button"
        onClick={() => {
          showModal(MODALS.SOCIAL_SIGN_IN);
        }}
      >
        Sign up for free
      </Button>
    ),
    exportData: (
      <Button
        key="exportData"
        style={styles.headerButton}
        category={EVENTS.CATEGORIES.UI_INTERACTION}
        action={EVENTS.ACTIONS.CLICKED.EXPORT_DATA}
        label="Header button"
        onClick={() => {
          showModal(MODALS.EXPORT_DATA);
        }}
      >For developers</Button>
    ),
    showHelp: (
      <Button
        key="showHelp"
        style={styles.headerButton}
        category={EVENTS.CATEGORIES.UI_INTERACTION}
        action={EVENTS.ACTIONS.SHOWED_HELP}
        label="Header button"
        onClick={() => {
          updateUser(user.id, {
            showHelp: true,
          });
        }}
      >Help</Button>
    ),
    signOutButton: (
      <Button
        key="signOutButton"
        style={styles.signInOrOutButton}
        onClick={signOut}
        category={EVENTS.CATEGORIES.UI_INTERACTION}
        action={EVENTS.ACTIONS.CLICKED.SIGN_OUT}
        label="Header button"
      >Sign out</Button>
    ),
    myProjects: (
      <Button
        key="myProjects"
        style={[styles.homePageHeaderButton, styles.headerSecondaryButton]}
        category={EVENTS.CATEGORIES.UI_INTERACTION}
        action={EVENTS.ACTIONS.CLICKED.MY_PROJECTS}
        label="Header button"
        onClick={() => {
          const firstProjectId = Object.keys(projects)[0];

          browserHistory.push(`/project/my-project/${firstProjectId}`);
        }}
      >My projects</Button>
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

    if (!user.showHelp && signedIn) {
      actionItemElements.push(actionItems.showHelp);
    }

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
