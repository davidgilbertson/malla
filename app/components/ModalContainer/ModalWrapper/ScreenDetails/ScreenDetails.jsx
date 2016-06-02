import React from 'react';
const {Component, PropTypes} = React;
import forOwn from 'lodash/forOwn';

import Modal from '../Modal/Modal.jsx';

import {
  BOX_TYPES,
  DIMENSIONS,
} from '../../../../constants.js';

import {
  css,
} from '../../../../utils';

const styles = {
  nameInput: {
    width: '100%',
    ...css.inputStyle(),
    ...css.shadow('inset'),
  },
  descInput: {
    width: '100%',
    marginTop: DIMENSIONS.SPACE_S,
    height: DIMENSIONS.SPACE_L * 2,
    ...css.inputStyle(),
    ...css.shadow('inset'),
  },
  deleteRow: {
    color: 'red',
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
    let boxes = 0;
    let sure = true;

    forOwn(this.props.boxes, box => {
      if (box.type !== BOX_TYPES.LABEL && box.screenKeys[this.props.currentScreenKey]) {
        boxes++;
      }
    });

    if (boxes > 0) {
      sure = window.confirm(`Are you sure you want to delete this screen?\nThe text on this screen will NOT be deleted.`);
    }

    if (sure) {
      this.props.removeScreen(this.props.currentScreenKey);
      this.props.hideModal();
    }
  }

  componentDidMount() {
    this.nameEl.focus();
  }

  render() {
    let screen;
    let title;
    let deleteButton = null;

    if (this.props.mode === 'add') {
      screen = {
        name: '',
        description: '',
      };
      title = 'Add a screen';
    } else {
      screen = this.props.screens[this.props.currentScreenKey];
      title = `Editing '${screen.name}'`;

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
      <Modal
        {...this.props}
        title={title}
        width={DIMENSIONS.SPACE_L * 7}
        hideModal={this.upsertScreen}
        showOk={true}
      >
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
      </Modal>
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
};

export default ScreenDetails;
