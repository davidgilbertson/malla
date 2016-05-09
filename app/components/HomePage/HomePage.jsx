import React from 'react';
import Radium, {Style} from 'radium';
import {connect} from 'react-redux';

import {showModal} from '../../data/actionCreators.js';

import {
  BREAKPOINTS,
  COLORS,
  DIMENSIONS,
  MODALS,
} from '../../constants.js';

import {
  css,
} from '../../utils.js';

const styles = {
  css: {
    body: {
      backgroundColor: COLORS.PRIMARY_DARK,
      backgroundImage: `linear-gradient(45deg, ${COLORS.PRIMARY_DARK} 20%, ${COLORS.PRIMARY} 100%)`,
    },
  },
  main: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: 'url(/images/grid-dot_10x10.gif)',
    overflow: 'auto',
    paddingTop: DIMENSIONS.LAYOUT.HEADER_HEIGHT_HOME,
    color: COLORS.WHITE,
  },

  bannerWrapper: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    height: '20vh',
    flexShrink: 0,
    [BREAKPOINTS.LAPTOP]: {
      flexFlow: 'row',
      alignItems: 'flex-end',
    },
  },

  titleWrapper: {
    textAlign: 'center',
    flex: 618,
    fontSize: '20vh',
  },
  titleSpacer: {
    flex: 382,
  },

  contentWrapper: {
    flexShrink: 0,
    display: 'flex',
    flexFlow: 'column',
    width: '100%',
    marginTop: '4vh',
    [BREAKPOINTS.LAPTOP]: {
      flexFlow: 'row',
      alignItems: 'center',
    },
  },
  wordsWrapper: {
    flex: 1,
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    padding: '0 2vw',
    [BREAKPOINTS.LAPTOP]: {
      flex: 618,
    },
  },

  subTitle: {
    color: COLORS.WHITE,
    fontSize: 30,
    flex: 0,
    lineHeight: 1,
  },
  boxesWrapper: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'stretch',
    padding: '6vh 0',
    [BREAKPOINTS.TABLET_LANDSCAPE]: {
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
  },
  box: {
    border: `1px solid ${COLORS.WHITE}`,
    padding: 10,
    margin: '2vh 0',
    flex: '1 1 33.33%',
    alignSelf: 'stretch',
    textAlign: 'center',
    [BREAKPOINTS.TABLET_LANDSCAPE]: {
      margin: '0 1vw',
    },
  },
  boxTitle: {
    fontSize: 30,
  },
  boxDescription: {
    marginTop: 10,
  },
  signUpWrapper: {
    textAlign: 'center',
    flex: 0,
    [BREAKPOINTS.PHONE_ONLY]: {
      alignSelf: 'stretch',
    },
  },
  bigSignUpButton: {
    background: COLORS.ACCENT,
    fontSize: 25,
    fontWeight: 400,
    padding: 15,
    ...css.shadow('light'),
    [BREAKPOINTS.PHONE_ONLY]: {
      width: '100%',
    },
    [BREAKPOINTS.TABLET_PORTRAIT]: {
      fontSize: 30,
      padding: '20px 40px',
    },
  },

  pictureWrapper: {
    flex: 1,
    padding: '5vh 2vw',
    textAlign: 'center',
    [BREAKPOINTS.LAPTOP]: {
      padding: '0 2vw',
      flex: 382,
    },
  },
  picture: { // TODO (davidg): reset for img (IE border)
    width: 713,
    maxWidth: '100%',
    height: 'auto',
  }
};

let HomePage = ({showModal}) => (
  <div style={styles.main}>
    <Style rules={styles.css} />

    <div style={styles.bannerWrapper}>
      <h1 style={styles.titleWrapper}>
        Malla
      </h1>

      <div style={styles.titleSpacer}></div>
    </div>

    <div style={styles.contentWrapper}>
      <div style={styles.wordsWrapper}>
        <div style={styles.subTitle}>
          The visual CMS
        </div>

        <div style={styles.boxesWrapper}>
          <div style={styles.box}>
            <h2 style={styles.boxTitle}>
              Super&nbsp;fast
            </h2>

            <p style={styles.boxDescription}>
              Enter text in seconds, not minutes. Click, drag, type, repeat.
            </p>
          </div>

          <div style={styles.box}>
            <h2 style={styles.boxTitle}>
              Collaborative
            </h2>

            <p style={styles.boxDescription}>
              As you type, the layout instantly updates for all connected users.
            </p>
          </div>

          <div style={styles.box}>
            <h2 style={styles.boxTitle}>
              Simple&nbsp;API
            </h2>

            <p style={styles.boxDescription}>
              Just put .json at the end of the URL. Seriously.
            </p>
          </div>
        </div>

        <div style={styles.signUpWrapper}>
          <button
            style={styles.bigSignUpButton}
            onClick={() => {
              showModal(MODALS.SOCIAL_SIGN_IN);
            }}
          >
            Sign up for free
          </button>
        </div>
      </div>

      <div style={styles.pictureWrapper}>
        <img
          style={styles.picture}
          src="images/animatedDemo__713x534.png"
        />
      </div>
    </div>
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
