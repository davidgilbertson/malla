import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';

import Modal from '../Modal/Modal.jsx';
import {
  COLORS,
  INTERACTIONS,
} from '../../../../constants.js';

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
    // backgroundColor: '#3B5998',
    backgroundColor: COLORS.GRAY_LIGHT,
    cursor: 'default',
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  twitterButton: {
    // backgroundColor: '#55ACEE',
    backgroundColor: COLORS.GRAY_LIGHT,
    cursor: 'default',
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

        <button
          style={[styles.button, styles.facebookButton]}
          onClick={this.signIn.bind(this, 'facebook')}
          disabled={true}
        >Facebook</button>

        <button
          style={[styles.button, styles.googleButton]}
          onClick={this.signIn.bind(this, 'google')}
        >Google</button>

        <button
          style={[styles.button, styles.twitterButton]}
          onClick={this.signIn.bind(this, 'twitter')}
          disabled={true}
        >Twitter</button>
      </Modal>
    );
  }
}

SignInModal.propTypes = {
  projects: PropTypes.object.isRequired,
};

export default Radium(SignInModal);
