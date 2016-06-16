import React from 'react';
const {PropTypes} = React;

import Button from '../../Button/Button.jsx';
import PageModalWrapper from '../PageModalWrapper.jsx';

import {
  COLORS,
  DIMENSIONS,
  INTERACTIONS,
} from '../../../constants.js';
import {EVENTS} from '../../../tracker.js';

const styles = {
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: DIMENSIONS.SPACE_S,
  },
  button: {
    width: '100%',
    color: COLORS.WHITE,
    marginTop: 16,
    marginBottom: 16,
    height: DIMENSIONS.SPACE_L,
  },
  facebookButton: {
    backgroundColor: '#3B5998',
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  twitterButton: {
    backgroundColor: '#55ACEE',
  },
};

const SignInModal = props => {
  const signIn = provider => {
    props.hideModal();
    props.setInteraction(INTERACTIONS.SIGNING_IN_FROM_HOME_PAGE);
    props.signIn(provider);
  };

  return (
    <PageModalWrapper
      {...props}
      title={'Sign in'}
      width={DIMENSIONS.SPACE_L * 6}
      showOk={false}
    >
      <p style={styles.title}>Choose your flavor</p>

      <Button
        style={{...styles.button, ...styles.facebookButton}}
        onClick={() => signIn('facebook')}
        category={EVENTS.CATEGORIES.UI_INTERACTION}
        action={EVENTS.ACTIONS.CLICKED.SIGN_IN_WITH_FACEBOOK}
        label="Social sign in modal"
      >
        Facebook
      </Button>

      <Button
        style={{...styles.button, ...styles.googleButton}}
        onClick={() => signIn('google')}
        category={EVENTS.CATEGORIES.UI_INTERACTION}
        action={EVENTS.ACTIONS.CLICKED.SIGN_IN_WITH_GOOGLE}
        label="Social sign in modal"
      >
        Google
      </Button>

      <Button
        style={{...styles.button, ...styles.twitterButton}}
        onClick={() => signIn('twitter')}
        category={EVENTS.CATEGORIES.UI_INTERACTION}
        action={EVENTS.ACTIONS.CLICKED.SIGN_IN_WITH_TWITTER}
        label="Social sign in modal"
      >
        Twitter
      </Button>
    </PageModalWrapper>
  );
};

SignInModal.propTypes = {
  hideModal: PropTypes.func.isRequired,
};

export default SignInModal;
