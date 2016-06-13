import React from 'react';
const {Component, PropTypes} = React;

import {
  BOX_TYPES,
  COLORS,
  DIMENSIONS,
  TEXT_PADDING,
} from '../../../constants.js';

import {
  css,
  makeArray,
} from '../../../utils';

const styles = {
  nameInput: {
    width: '100%',
    ...css.inputStyle,
    ...css.shadow('inset'),
  },
  descInput: {
    width: '100%',
    marginTop: DIMENSIONS.SPACE_S,
    height: DIMENSIONS.SPACE_L * 2,
    resize: 'none',
    ...css.inputStyle,
    padding: TEXT_PADDING,
    ...css.shadow('inset'),
  },
  deleteRow: {
    color: COLORS.ERROR,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 400,
  },
};

class ScreenDetails extends Component {
  constructor(props) {
    super(props);

    this.upsertScreen = this.upsertScreen.bind(this);
    this.deleteScreen = this.deleteScreen.bind(this);
  }

  upsertScreen() {
    if (this.nameEl.value) {
      if (this.props.mode === 'add') {
        this.props.addScreen({
          name: this.nameEl.value,
          description: this.descriptionEl.value,
        });
      } else {
        this.props.updateScreen(this.props.currentScreenKey, {
          name: this.nameEl.value,
          description: this.descriptionEl.value,
        });
      }
    }

    this.props.hideModal();
  }

  deleteScreen() {
    let sure = true;

    const boxCount = makeArray(this.props.boxes)
      .filter(box => box.type !== BOX_TYPES.LABEL && box.screenKeys[this.props.currentScreenKey])
      .length;

    if (boxCount > 0) {
      const screen = this.props.screens[this.props.currentScreenKey];
      let msg = `Are you sure you want to delete the screen '${screen.name}'?`;
      msg += `\nThis will also delete the ${boxCount} text item${boxCount === 1 ? '' : 's'} on the screen.`;
      sure = window.confirm(msg);
    }

    if (sure) {
      this.props.removeScreen(this.props.currentScreenKey);
      this.props.hideModal();
    }
  }

  componentDidMount() {
    this.nameEl.focus();

    this.props.setModalState({
      title: this.props.mode === 'add' ? 'Add a screen' : 'Edit screen',
      width: DIMENSIONS.SPACE_L * 7,
      showOk: true,
      okText: 'Save',
      onOk: this.upsertScreen,
    });
  }

  render() {
    let screen;
    let deleteButton = null;

    if (this.props.mode === 'add') {
      screen = {
        name: '',
        description: '',
      };
    } else {
      screen = this.props.screens[this.props.currentScreenKey];

      deleteButton = Object.keys(this.props.screens).length > 1
        ? (
          <div style={styles.deleteRow}>
            <button
              onClick={this.deleteScreen}
              tabIndex="-1"
            >
              Delete this screen
            </button>
          </div>
        ) : null;
    }

    return (
      <div>
        <div>
          <input
            ref={el => this.nameEl = el}
            defaultValue={screen.name}
            style={styles.nameInput}
          />
        </div>

        <div>
          <textarea
            ref={el => this.descriptionEl = el}
            defaultValue={screen.description}
            style={styles.descInput}
          />
        </div>

        {deleteButton}
      </div>
    );
  }
}

ScreenDetails.propTypes = {
  // props
  mode: PropTypes.oneOf(['add', 'edit']),
  currentScreenKey: PropTypes.string,
  screens: PropTypes.object,
  boxes: PropTypes.object,

  // methods
  addScreen: PropTypes.func.isRequired,
  updateScreen: PropTypes.func.isRequired,
  removeScreen: PropTypes.func.isRequired,
  setModalState: PropTypes.func.isRequired,
};

export default ScreenDetails;
