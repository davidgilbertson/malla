import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';

import Modal from '../Modal/Modal.jsx';
import Button from '../../../Button/Button.jsx';
import {
  COLORS,
  INTERACTIONS,
} from '../../../../constants.js';

import {EVENTS} from '../../../../tracker.js';

const styles = {
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },
  button: {
    width: '100%',
    color: COLORS.WHITE,
    marginTop: 16,
    marginBottom: 16,
    height: 61,
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

class SignInModal extends Component {
  constructor(props) {
    super(props);
  }

  signIn(provider) {
    this.props.setInteraction(INTERACTIONS.SIGNING_IN_FROM_HOME_PAGE);
    this.props.signIn(provider);
  }

  render() {
    return (
      <Modal
        {...this.props}
        title="Sign in"
        width={400}
      >
        <p style={styles.title}>Choose your flavor</p>

        <Button
          style={[styles.button, styles.facebookButton]}
          onClick={this.signIn.bind(this, 'facebook')}
          category={EVENTS.CATEGORIES.UI_INTERACTION}
          action={EVENTS.ACTIONS.CLICKED.SIGN_IN_WITH_FACEBOOK}
          label="Social sign in modal"
        >
          Facebook
        </Button>

        <Button
          style={[styles.button, styles.googleButton]}
          onClick={this.signIn.bind(this, 'google')}
          category={EVENTS.CATEGORIES.UI_INTERACTION}
          action={EVENTS.ACTIONS.CLICKED.SIGN_IN_WITH_GOOGLE}
          label="Social sign in modal"
        >
          Google
        </Button>

        <Button
          style={[styles.button, styles.twitterButton]}
          onClick={this.signIn.bind(this, 'twitter')}
          category={EVENTS.CATEGORIES.UI_INTERACTION}
          action={EVENTS.ACTIONS.CLICKED.SIGN_IN_WITH_TWITTER}
          label="Social sign in modal"
        >
          Twitter
        </Button>
      </Modal>
    );
  }
}

SignInModal.propTypes = {
  projects: PropTypes.object.isRequired,
};

export default Radium(SignInModal);
