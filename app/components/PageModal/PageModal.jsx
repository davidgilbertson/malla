import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';

import Panel from '../Panel/Panel.jsx';
import ExportDataModal from './ExportDataModal/ExportDataModal.jsx';
import SignInModal from './SignInModal/SignInModal.jsx';
import FeedbackModal from './FeedbackModal/FeedbackModal.jsx';
import ScreenDetails from './ScreenDetails/ScreenDetails.jsx';
import BoxDetails from './BoxDetails/BoxDetails.jsx';

import {
  COLORS,
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
  panelBelowSpacer: {
    flex: '6 0 auto',
  },
};

class PageModal extends Component {
  constructor(props) {
    super(props);

    this.onBackgroundClick = this.onBackgroundClick.bind(this);
    
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
  
  componentWillReceiveProps(nextProps) {
    // When the modal changes, we need to reset the state
    // to clear any props not set by the new modal
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

    return (
      <div
        style={styles.back}
        onClick={this.onBackgroundClick}
      >
        <div style={styles.panelAboveSpacer}></div>

        <Panel
          {...this.props}
          {...this.state}
        >
          <ModalBody
            {...this.props}
            {...extraProps}
            setModalState={state => this.setState(state)}
            />
        </Panel>

        <div style={styles.panelBelowSpacer}></div>
      </div>
    );
  }
}

PageModal.propTypes = {
  // props
  currentModal: PropTypes.string.isRequired,

  // methods
  hideModal: PropTypes.func.isRequired,
};

export default Radium(PageModal);
