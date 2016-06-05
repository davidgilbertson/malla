import React from 'react';
const {Component, PropTypes} = React;
import {connect} from 'react-redux';
import Radium from 'radium';

import Button from '../Button/Button.jsx';
import Panel from '../Panel/Panel.jsx';

import {
  BREAKPOINTS,
  COLORS,
  DIMENSIONS,
  SIGN_IN_STATUSES,
  Z_INDEXES,
} from '../../constants.js';
import * as actions from '../../data/actions.js';

import {EVENTS} from '../../tracker.js';

const styles = {
  panel: {
    position: 'absolute',
    flex: '0 0 auto',
    display: 'flex',
    flexFlow: 'column',
    top: DIMENSIONS.SPACE_S,
    right: '1vw',
    left: '1vw',
    maxHeight: '90%',
    maxWidth: '98vw',
    width: 'auto',
    zIndex: Z_INDEXES.HELP_PANEL,
    [BREAKPOINTS.TABLET_PORTRAIT]: {
      width: 400,
      right: DIMENSIONS.SPACE_S,
      left: 'auto',
    },
  },
  body: {
    flex: 1,
    overflow: 'auto',
  },
  subtitle: {
    marginTop: 40,
    textAlign: 'center',
  },
  list: {
    marginTop: 20,
    paddingLeft: 20,
  },
  listItem: {
    marginTop: 5,
  },
  actions: {
    padding: 20,
    textAlign: 'center',
    flex: '0 0 auto',
  },
  okButton: {
    backgroundColor: COLORS.PRIMARY,
    color: COLORS.WHITE,
    padding: 12,
    minWidth: 100,
  },
};

class HelpPanel extends Component {
  constructor(props) {
    super(props);

    this.closeHelp = this.closeHelp.bind(this);
  }

  closeHelp() {
    this.props.updateUser({
      showHelp: false,
    });
  }

  render() {
    const {user} = this.props;

    if (!user.showHelp || user.signInStatus !== SIGN_IN_STATUSES.SIGNED_IN) return null;

    return (
      <Panel
        title="Welcome to Malla"
        showOk={false}
        width={400}
        style={styles.panel}
        showClose={false}
      >
        <div>
          <p>On this screen, add any text that you want shown in your website or app.</p>

          <h2 style={styles.subtitle}>Things you can do</h2>

          <ul style={styles.list}>
            <li style={styles.listItem}>Click and drag to add a new box.</li>

            <li style={styles.listItem}>Click a box once to move or resize the box.</li>

            <li style={styles.listItem}>Click again to edit the text.</li>

            <li style={styles.listItem}>
              When a box is selected, click delete to remove it. Make sure you
              don’t remove a box that’s being used in your website!
            </li>

            <li style={styles.listItem}>
              You can arrange boxes on the page however you like. This won’t
              affect how they appear on your site, but will make it easy to locate a
              particular piece of text in the future.
            </li>

            <li style={styles.listItem}>
              When you're done, click the 'For Developers' button in the top
              right and send the link you see there to your nearest friendly developer;
              they will make sure the text ends up in the website.
            </li>
          </ul>
        </div>

        <div style={styles.actions}>
          <Button
            style={styles.okButton}
            category={EVENTS.CATEGORIES.UI_INTERACTION}
            action={EVENTS.ACTIONS.HID_HELP}
            label="Help panel"
            onClick={this.closeHelp}
          >
            Got it
          </Button>
        </div>
      </Panel>
    );
  }
}

HelpPanel.propTypes = {
  // state
  user: PropTypes.object.isRequired,

  // actions
  updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = () => {
  return {
    updateUser: newProps => {
      actions.updateUser(newProps);
    },
  };
};

HelpPanel = Radium(HelpPanel);
HelpPanel = connect(mapStateToProps, mapDispatchToProps)(HelpPanel);

export default HelpPanel;
