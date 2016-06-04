import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';

import Button from '../Button/Button.jsx';
import ExportDataModal from './ExportDataModal/ExportDataModal.jsx';
import SignInModal from './SignInModal/SignInModal.jsx';
import FeedbackModal from './FeedbackModal/FeedbackModal.jsx';
import ScreenDetails from './ScreenDetails/ScreenDetails.jsx';
import BoxDetails from './BoxDetails/BoxDetails.jsx';

import {
  COLORS,
  DIMENSIONS,
  MODALS,
  Z_INDEXES,
} from '../../constants.js';

const styles = {
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
    flex: 1,
    padding: DIMENSIONS.SPACE_S,
    overflow: 'auto',
  },
  actions: {
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

class Modal extends Component {
  constructor(props) {
    super(props);

    this.onBackgroundClick = this.onBackgroundClick.bind(this);
    this.onOk = this.onOk.bind(this);
    
    // state can be passed UP from the modal's content
    // this is kinda the equivalent of defaultProps
    this.defaultState = {
      title: '',
      showOk: true,
      okText: 'OK',
      okDisabled: false,
      width: 400,
      onOk: () => {}
    };

    this.state = this.defaultState; // doesn't matter that this is a ref because setState clones
  }

  onBackgroundClick(e) {
    if (e.target !== e.currentTarget) return;

    this.props.hideModal();
  }
  
  onOk() {
    this.state.onOk();
    this.props.hideModal();
  }

  componentWillReceiveProps(nextProps) {
    // When the modal changes, we need to reset the state
    // to clear any props not set by the new state
    if (nextProps.currentModal !== this.props.currentModal) {
      this.setState(this.defaultState);
    }
  }

  render() {
    let ModalBody;
    let extraProps = {};

    switch (this.props.currentModal) {
      case MODALS.EXPORT_DATA :
        ModalBody = ExportDataModal;
        break;

      case MODALS.SOCIAL_SIGN_IN :
        ModalBody = SignInModal;
        break;

      case MODALS.FEEDBACK :
        ModalBody = FeedbackModal;
        break;

      case MODALS.ADD_SCREEN :
        ModalBody = ScreenDetails;
        extraProps.mode = 'add';
        break;

      case MODALS.EDIT_SCREEN :
        ModalBody = ScreenDetails;
        extraProps.mode = 'edit';
        break;

      case MODALS.EDIT_BOX :
        ModalBody = BoxDetails;
        break;

      default :
        return null;
    }

    const actions = this.state.showOk
      ? (
        <div style={styles.actions}>
          <Button
            style={styles.okButton}
            onClick={this.onOk}
            disabled={this.state.okDisabled}
          >
            {this.state.okText}
          </Button>
        </div>
      ) : null;
    
    return (
      <div
        style={styles.back}
        onClick={this.onBackgroundClick}
      >
        <div style={styles.panelAboveSpacer}></div>

        <div style={[styles.panel, {width: this.state.width}]}>
          <div style={styles.header}>
            <h1 style={styles.title}>
              {this.state.title}
            </h1>

            <Button
              style={styles.close}
              onClick={this.props.hideModal}
            >
              Close
            </Button>
          </div>

          <div style={styles.body}>
            <ModalBody
              {...this.props}
              {...extraProps}
              setModalState={state => this.setState(state)}
              />
          </div>

          {actions}
        </div>

        <div style={styles.panelBelowSpacer}></div>
      </div>
    );
  }
}

Modal.propTypes = {
  // props
  currentModal: PropTypes.string.isRequired,

  // methods
  hideModal: PropTypes.func.isRequired,
};

export default Radium(Modal);
