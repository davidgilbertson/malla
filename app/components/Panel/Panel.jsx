import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';

import Button from '../Button/Button.jsx';

import {
  COLORS,
  DIMENSIONS,
} from '../../constants.js';

import {
  css,
} from '../../utils'

const styles = {
  panelWrapper: { // So that the body height is correct. https://github.com/philipwalton/flexbugs#3-min-height-on-a-flex-container-wont-apply-to-its-flex-items
    display: 'flex',
    flexFlow: 'column',
  },
  panel: {
    flex: '0 0 auto',
    display: 'flex',
    flexFlow: 'column',
    maxHeight: '94vh',
    maxWidth: '98vw',
    backgroundColor: COLORS.WHITE,
    ...css.shadow(),
  },
  header: {
    height: 64,
    flex: '0 0 auto',
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `3px solid ${COLORS.PRIMARY_LIGHT}`,
    backgroundColor: COLORS.PRIMARY,
    color: COLORS.WHITE,
  },
  title: {
    fontSize: 22,
    paddingLeft: 20,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  close: {
    padding: 20,
    fontSize: 16,
  },
  body: {
    flex: '1 1 auto',
    padding: DIMENSIONS.SPACE_S,
    overflow: 'auto',
  },
  actions: {
    flex: '0 0 auto',
    padding: 20,
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: COLORS.PRIMARY,
    color: COLORS.WHITE,
    padding: 12,
    minWidth: 100,
  },
};

class Panel extends Component {
  constructor(props) {
    super(props);

    this.onOk = this.onOk.bind(this);
  }

  onOk() {
    this.props.onOk();
    this.props.hideModal();
  }

  render() {
    const actions = this.props.showOk
      ? (
        <div style={styles.actions}>
          <Button
            style={styles.okButton}
            onClick={this.onOk}
            disabled={this.props.okDisabled}
          >
            {this.props.okText}
          </Button>
        </div>
      ) : null;

    const closeButton = this.props.showClose
      ? (
        <Button
          style={styles.close}
          onClick={this.props.hideModal}
        >
          Close
        </Button>
      ) : null;
    
    const panelStyle = {
      ...styles.panel,
      width: this.props.width,
      ...this.props.style,
    };

    return (
      <div style={styles.panelWrapper}>
        <div style={panelStyle}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              {this.props.title}
            </h1>

            {closeButton}
          </div>

          <div style={styles.body}>
            {this.props.children}
          </div>

          {actions}
        </div>
      </div>
    );
  }
}

Panel.propTypes = {
  title: PropTypes.string,
  showClose: PropTypes.bool,
  showOk: PropTypes.bool,
  okText: PropTypes.string,
  okDisabled: PropTypes.bool,
  width: PropTypes.number,
  onOk: PropTypes.func,
  // props
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,

  // methods
  hideModal: PropTypes.func.isRequired,
};

Panel.defaultProps = {
  title: '',
  showClose: true,
  showOk: true,
  okText: 'OK',
  okDisabled: false,
  width: 400,
  onOk: () => {}
};

export default Radium(Panel);
