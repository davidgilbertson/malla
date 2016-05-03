import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';
import cloneDeep from 'lodash/cloneDeep';

import {
  COLORS,
  Z_INDEXES,
} from '../../../../constants.js';
import Button from '../../../Button/Button.jsx';

const baseStyles = {
  back: {
    position: 'fixed',
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.GRAY_FADE,
    zIndex: Z_INDEXES.MODAL,
    cursor: 'default',
  },
  panelAboveSpacer: {
    flex: '2 0 auto',
  },
  panel: {
    flex: '0 0 auto',
    display: 'flex',
    flexFlow: 'column',
    width: 400,
    maxHeight: '94vh',
    maxWidth: '98vw',
    backgroundColor: COLORS.WHITE,
  },
  panelBelowSpacer: {
    flex: '6 0 auto',
  },
  header: {
    height: 64,
    flex: '0 0 auto',
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `3px solid ${COLORS.PRIMARY_LIGHT}`,
    background: COLORS.PRIMARY,
    color: COLORS.WHITE,
  },
  title: {
    fontSize: 22,
    paddingLeft: 20,
  },
  close: {
    padding: 20,
    fontSize: 16,
    textDecoration: 'underline',
  },
  body: {
    flex: 1,
    padding: 20,
    overflow: 'auto',
  },
  actions: {
    padding: 20,
    textAlign: 'center',
  },
};

class Modal extends Component {
  constructor(props) {
    super(props);

    this.maybeClose = this.maybeClose.bind(this);
  }

  maybeClose(e) {
    if (e.target !== e.currentTarget) return;

    this.props.hideModal();
  }

  render() {
    const styles = cloneDeep(baseStyles);

    if (this.props.width) {
      styles.panel.width = this.props.width;
    }

    const actions = this.props.showOK
      ? (
        <div style={styles.actions}>
          <Button onClick={this.props.hideModal}>
            OK
          </Button>
        </div>
      ) : null;

    return (
      <div
        style={styles.back}
        onClick={this.maybeClose}
      >
        <div style={styles.panelAboveSpacer}></div>

        <div style={styles.panel}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              {this.props.title}
            </h1>

            <button
              style={styles.close}
              onClick={this.props.hideModal}
            >
              Close
            </button>
          </div>

          <div style={styles.body}>
            {this.props.children}
          </div>

          {actions}
        </div>

        <div style={styles.panelBelowSpacer}></div>
      </div>
    );
  }
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  hideModal: PropTypes.func.isRequired,
  width: PropTypes.number,
  showOK: PropTypes.bool,
};

export default Radium(Modal);
