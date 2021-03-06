import React from 'react';
const {PropTypes} = React;
import Radium, {Style} from 'radium';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import Button from '../Button/Button.jsx';
import * as actions from '../../data/actions.js';

import {
  BREAKPOINTS,
  COLORS,
  DIMENSIONS,
  MODALS,
} from '../../constants.js';

import {
  css,
} from '../../utils';

import {EVENTS} from '../../tracker.js';

const styles = {
  css: {
    body: {
      backgroundColor: COLORS.PRIMARY_DARK,
      backgroundImage: `linear-gradient(45deg, ${COLORS.PRIMARY_DARK} 20%, ${COLORS.PRIMARY} 100%)`,
    },
  },
  main: {
    minHeight: '100vh',
    backgroundImage: 'url(/images/grid-dot-blue_20x20.gif)',
    backgroundSize: '10px 10px',
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
    whiteSpace: 'pre-wrap',
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
    backgroundColor: COLORS.ACCENT,
    fontSize: 25,
    fontWeight: 400,
    padding: 15,
    ...css.shadow('small'),
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
  gettingStartedLink: {
    marginTop: DIMENSIONS.SPACE_L,
    fontSize: 20,
    textAlign: 'center',
  },
  faqWrapper: {
    width: 320,
    margin: '80px auto 0',
    [BREAKPOINTS.TABLET_PORTRAIT]: {
      width: 426,
    },
    [BREAKPOINTS.TABLET_LANDSCAPE]: {
      width: 640,
    },
  },
  question: {
    color: COLORS.WHITE,
    fontSize: 32,
    marginTop: 60,
  },
  answer: {
    color: COLORS.WHITE,
    marginTop: 10,
    fontSize: 18,
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
  },
};

let HomePage = props => (
  <div
    className="home-page"
    style={styles.main}
  >
    <Style rules={styles.css} />

    <h1 style={styles.title}>{MALLA_TEXT.title}</h1>

    <div style={styles.subTitle}>{MALLA_TEXT.slogan}</div>

    <div style={styles.boxesWrapper}>
      <div style={styles.box}>
        <h2 style={styles.boxTitle}>{MALLA_TEXT.box1Title}</h2>

        <p style={styles.boxDescription}>{MALLA_TEXT.box1Desc}</p>
      </div>

      <div style={styles.box}>
        <h2 style={styles.boxTitle}>{MALLA_TEXT.box2Title}</h2>

        <p style={styles.boxDescription}>{MALLA_TEXT.box2Desc}</p>
      </div>

      <div style={styles.box}>
        <h2 style={styles.boxTitle}>{MALLA_TEXT.box3Title}</h2>

        <p style={styles.boxDescription}>{MALLA_TEXT.box3Desc}</p>
      </div>
    </div>

    <iframe style={styles.video} src="https://www.youtube.com/embed/aHzVmEWxek8?rel=0" frameBorder="0" allowFullScreen></iframe>

    <Button
      style={styles.bigSignUpButton}
      category={EVENTS.CATEGORIES.UI_INTERACTION}
      action={EVENTS.ACTIONS.CLICKED.SIGN_UP}
      label="Home page"
      onClick={() => {
        props.showModal(MODALS.SOCIAL_SIGN_IN);
      }}
    >
      {MALLA_TEXT.signUpLong}
    </Button>

    <div style={styles.faqWrapper}>
      <p style={styles.gettingStartedLink}>
        <span>{MALLA_TEXT.homePageGettingStartedLink1} </span>

        <Link to="/docs/getting-started">{MALLA_TEXT.homePageGettingStartedLink2}</Link>

        <span> {MALLA_TEXT.homePageGettingStartedLink3}</span>
      </p>

      <h2 style={styles.question}>{MALLA_TEXT.question1}</h2>
      <p style={styles.answer}>{MALLA_TEXT.answer1}</p>

      <h2 style={styles.question}>{MALLA_TEXT.question2}</h2>
      <p style={styles.answer}>{MALLA_TEXT.answer2}</p>

      <h2 style={styles.question}>{MALLA_TEXT.question3}</h2>
      <p style={styles.answer}>{MALLA_TEXT.answer3}</p>
    </div>
  </div>
);

HomePage.propTypes = {
  // state
  user: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  screens: PropTypes.object.isRequired,
  interaction: PropTypes.string,

  // actions
  showModal: PropTypes.func.isRequired,
};

HomePage = Radium(HomePage);

const bindStateToProps = state => ({
  user: state.user,
  projects: state.projects,
  screens: state.screens,
  interaction: state.interaction,
});

const bindDispatchToProps = () => ({
  showModal: actions.showModal,
});

HomePage = connect(bindStateToProps, bindDispatchToProps)(HomePage);

export default HomePage;
