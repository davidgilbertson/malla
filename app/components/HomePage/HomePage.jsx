import React from 'react';
import Radium, {Style} from 'radium';
import {connect} from 'react-redux';

import Button from '../Button/Button.jsx';
import {showModal} from '../../data/actionCreators.js';

import {
  BREAKPOINTS,
  COLORS,
  DIMENSIONS,
  MODALS,
  WORDS,
} from '../../constants.js';

import {
  css,
} from '../../utils.js';

import {EVENTS} from '../../tracker.js';

const styles = {
  css: {
    body: {
      backgroundColor: COLORS.PRIMARY_DARK,
      backgroundImage: `linear-gradient(45deg, ${COLORS.PRIMARY_DARK} 20%, ${COLORS.PRIMARY} 100%)`,
    },
  },
  main: {
    minHeight: '100%',
    backgroundImage: 'url(/images/grid-dot_10x10.gif)',
    overflow: 'auto',
    padding: `${DIMENSIONS.LAYOUT.HEADER_HEIGHT_HOME}px 20px 80px`,
    color: COLORS.WHITE,
  },
  title: {
    textAlign: 'center',
    fontSize: 100,
    marginTop: 40,
    [BREAKPOINTS.TABLET_PORTRAIT]: {
      marginTop: 50,
      fontSize: 170,
    },
    [BREAKPOINTS.DESKTOP]: {
      marginTop: 80,
    },
  },
  subTitle: {
    color: COLORS.WHITE,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30,
    [BREAKPOINTS.TABLET_PORTRAIT]: {
      fontSize: 25,
    },
  },
  boxesWrapper: {
    margin: '10px auto 0',
    maxWidth: 900,
    [BREAKPOINTS.DESKTOP]: {
      margin: '40px auto 0',
    },
  },
  box: {
    border: `1px solid ${COLORS.WHITE}`,
    padding: 10,
    margin: '40px auto 0',
    textAlign: 'center',
    width: '100%',
    maxWidth: 500,
    [BREAKPOINTS.TABLET_LANDSCAPE]: {
      display: 'inline-block',
      width: '30%',
      margin: '40px 1.6% 0',
    },
  },
  boxTitle: {
    fontSize: 30,
  },
  boxDescription: {
    marginTop: 10,
  },
  video: {
    display: 'block',
    width: 320,
    height: 180,
    margin: '40px auto 0',
    textAlign: 'center',
    [BREAKPOINTS.TABLET_PORTRAIT]: {
      width: 426,
      height: 240,
    },
    [BREAKPOINTS.TABLET_LANDSCAPE]: {
      width: 640,
      height: 360,
      margin: '60px auto 0',
    },
    [BREAKPOINTS.DESKTOP]: {
      margin: '80px auto 0',
    },
  },
  signUpWrapper: {
    textAlign: 'center',
    marginTop: 80,
  },
  bigSignUpButton: {
    display: 'block',
    background: COLORS.ACCENT,
    fontSize: 25,
    fontWeight: 400,
    padding: 15,
    ...css.shadow('light'),
    width: 400,
    margin: '40px auto 0',
    [BREAKPOINTS.PHONE_ONLY]: {
      width: '100%',
    },
    [BREAKPOINTS.TABLET_PORTRAIT]: {
      fontSize: 30,
      padding: '20px 40px',
    },
    [BREAKPOINTS.DESKTOP]: {
      margin: '80px auto 0',
    },
  },
};

let HomePage = ({showModal}) => (
  <div style={styles.main}>
    <Style rules={styles.css} />

    <h1 style={styles.title}>{WORDS.MALLA}</h1>

    <div style={styles.subTitle}>{WORDS.SLOGAN}</div>

    <div style={styles.boxesWrapper}>
      <div style={styles.box}>
        <h2 style={styles.boxTitle}>Super fast</h2>

        <p style={styles.boxDescription}>Update your site's copy in seconds. Just click, drag, type.</p>
      </div>

      <div style={styles.box}>
        <h2 style={styles.boxTitle}>Collaborative</h2>

        <p style={styles.boxDescription}>As you type, the layout instantly updates for all connected users.</p>
      </div>

      <div style={styles.box}>
        <h2 style={styles.boxTitle}>Simple API</h2>

        <p style={styles.boxDescription}>Just put .json at the end of the URL. Seriously.</p>
      </div>
    </div>

    <iframe style={styles.video} src="https://www.youtube.com/embed/gSdnYofmtr8?rel=0" frameBorder="0" allowFullScreen></iframe>

    <Button
      style={styles.bigSignUpButton}
      category={EVENTS.CATEGORIES.UI_INTERACTION}
      action={EVENTS.ACTIONS.CLICKED.SIGN_UP}
      label="Home page"
      onClick={() => {
        showModal(MODALS.SOCIAL_SIGN_IN);
      }}
    >
      Sign up for free
    </Button>
  </div>
);

HomePage = Radium(HomePage);

HomePage = connect(null, dispatch => {
  return {
    showModal: modal => {
      dispatch(showModal(modal));
    },
  };
})(HomePage);

export default HomePage;
