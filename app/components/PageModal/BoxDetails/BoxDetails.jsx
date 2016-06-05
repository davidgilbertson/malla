import React from 'react';
const {Component, PropTypes} = React;
import forOwn from 'lodash/forOwn';

import {
  BOX_TYPES,
  COLORS,
  DIMENSIONS,
} from '../../../constants.js';

import {
  css,
} from '../../../utils';

const styles = {
  idInput: {
    width: '100%',
    ...css.inputStyle,
    ...css.shadow('inset'),
  },
  label: {
    fontWeight: 400,
    display: 'inline-block',
    paddingBottom: 5,
  },
  labelDesc: {
    fontWeight: 300,
    fontSize: 13,
    color: COLORS.GRAY,
  },
  idError: {
    fontSize: 13,
    fontWeight: 400,
    display: 'block',
    minHeight: 20, // so that it takes the same height when empty
    color: COLORS.ERROR,
    marginTop: 4,
  },
  textInput: {
    width: '100%',
    height: DIMENSIONS.SPACE_L * 3,
    ...css.inputStyle,
    ...css.shadow('inset'),
  },
  deleteRow: {
    color: COLORS.ERROR,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 400,
  },
};

class BoxDetails extends Component {
  constructor(props) {
    super(props);

    this.updateBox = this.updateBox.bind(this);
    this.deleteBox = this.deleteBox.bind(this);
    this.onIdChange = this.onIdChange.bind(this);

    const currentScreen = this.props.screens[this.props.currentScreenKey];
    this.currentProjectKey = currentScreen.projectKey;

    this.state = {
      idIsAvailable: true,
      idIsNotEmpty: true,
      idIsValidFormat: true,
      isValidOverall: true,
    };
  }

  onIdChange(e) {
    const currentId = e.target.value;
    let idIsAvailable = true;
    let idIsNotEmpty = true;
    let idIsValidFormat = true;

    if (!currentId) {
      idIsNotEmpty = false;
    } else if (!/^[A-Za-z][A-Za-z0-9-_]*$/.test(currentId)) {
      idIsValidFormat = false;
    }

    forOwn(this.props.boxes, (box, key) => {
      const boxIsInCurrentProject = box.projectKey === this.currentProjectKey;
      const boxHasSameLabelAsInput = box.label === currentId;
      const boxIsNotTheBoxBeingEdited = key !== this.props.activeBox.id;

      if (boxIsInCurrentProject && boxHasSameLabelAsInput && boxIsNotTheBoxBeingEdited) {
        idIsAvailable = false;
      }
    });

    if (this.state.idIsAvailable !== idIsAvailable) {
      this.setState({idIsAvailable});
    }

    if (this.state.idIsNotEmpty !== idIsNotEmpty) {
      this.setState({idIsNotEmpty});
    }

    if (this.state.idIsValidFormat !== idIsValidFormat) {
      this.setState({idIsValidFormat});
    }

    const isValidOverall = idIsAvailable && idIsNotEmpty && idIsValidFormat;

    if (this.state.isValidOverall !== isValidOverall) {
      this.setState({isValidOverall});
      this.props.setModalState({okDisabled: !isValidOverall});
    }
  }

  updateBox() {
    const idIsValid = this.state.idIsNotEmpty && this.state.idIsAvailable;
    const box = this.props.boxes[this.props.activeBox.id];
    const isLabel = box.type === BOX_TYPES.LABEL;

    if (isLabel || idIsValid) {
      const newProps = {
        text: this.textEl.value,
      };

      if (!isLabel) {
        newProps.label = this.idEl.value;
      }

      this.props.updateBox(this.props.activeBox.id, newProps);
    }

    this.props.setActiveBox(null);
    this.props.hideModal();
  }

  deleteBox() {
    const box = this.props.boxes[this.props.activeBox.id];
    let sure = true;

    if (box.type !== BOX_TYPES.LABEL && box.text) {
      sure = window.confirm('If you delete this and it is being used, things will break. Cool?');
    }

    if (sure) {
      this.props.setActiveBox(null);
      this.props.removeBox(this.props.activeBox.id);
      this.props.hideModal();
    }
  }

  componentDidMount() {
    const box = this.props.boxes[this.props.activeBox.id];

    if (box.type === BOX_TYPES.LABEL) {
      this.textEl.focus();
    } else {
      this.idEl.focus();
    }

    this.props.setModalState({
      title: 'Edit text item',
      width: DIMENSIONS.SPACE_L * 11,
      showOk: true,
      okText: 'Save',
      onOk: this.updateBox,
      okDisabled: !this.state.isValidOverall,
    });
  }

  render() {
    if (!this.props.activeBox) {
      console.warn('The edit box modal is trying to show but there is no active box');
      return null;
    }
    
    const box = this.props.boxes[this.props.activeBox.id];
    
    if (!box) {
      console.warn(`No box with an id '${this.props.activeBox.id} could be found`);
      return null;
    }

    let idError = '';

    if (!this.state.idIsAvailable) {
      idError = 'This id is already in use';
    } else if (!this.state.idIsNotEmpty) {
      idError = 'Try something a little more descriptive';
    } else if (!this.state.idIsValidFormat) {
      idError = 'The ID must only contain letters, numbers, dashes and underscores. It cannot start with a number.';
    }

    // Don't show ID stuff if the box is just a label
    const idInputs = box.type !== BOX_TYPES.LABEL
      ? (
        <label>
            <span style={styles.label}>
              ID <span style={styles.labelDesc}>(This is how the text item is identified in code)</span>
            </span>

          <input
            ref={el => this.idEl = el}
            defaultValue={box.label}
            style={styles.idInput}
            onChange={this.onIdChange}
          />

          <span style={styles.idError}>{idError}</span>
        </label>
      ) : null;

    return (
      <div>
        {idInputs}

        <label>
          <span style={styles.label}>Text</span>

          <textarea
            ref={el => this.textEl = el}
            defaultValue={box.text}
            style={styles.textInput}
          />
        </label>

        <div style={styles.deleteRow}>
          <button
            onClick={this.deleteBox}
            tabIndex="-1"
          >
            Delete this text item
          </button>
        </div>
      </div>
    );
  }
}

BoxDetails.propTypes = {
  // props
  activeBox: PropTypes.object,
  boxes: PropTypes.object,
  currentScreenKey: PropTypes.string.isRequired,
  screens: PropTypes.object.isRequired,

  // methods
  updateBox: PropTypes.func.isRequired,
  removeBox: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  setActiveBox: PropTypes.func.isRequired,
  setModalState: PropTypes.func.isRequired,
};

export default BoxDetails;
