import React from 'react';
const {PropTypes} = React;

import PageModalWrapper from '../PageModalWrapper.jsx';

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

const ScreenDetails = props => {
  let nameEl;
  let descriptionEl;

  const upsertScreen = () => {
    if (nameEl.value) {
      if (props.mode === 'add') {
        props.addScreen({
          name: nameEl.value,
          description: descriptionEl.value,
        });
      } else {
        props.updateScreen(props.currentScreenKey, {
          name: nameEl.value,
          description: descriptionEl.value,
        });
      }
    }

    props.hideModal();
  };

  const deleteScreen = () => {
    let sure = true;

    const boxCount = makeArray(props.boxes)
      .filter(box => box.type !== BOX_TYPES.LABEL && box.screenKeys[props.currentScreenKey])
      .length;

    if (boxCount > 0) {
      const screen = props.screens[props.currentScreenKey];
      let msg = `Are you sure you want to delete the screen '${screen.name}'?`;
      msg += `\nThis will also delete the ${boxCount} text item${boxCount === 1 ? '' : 's'} on the screen.`;
      sure = window.confirm(msg);
    }

    if (sure) {
      props.removeScreen(props.currentScreenKey);
      props.hideModal();
    }
  };

  let screen;
  let deleteButton = null;

  if (props.mode === 'add') {
    screen = {
      name: '',
      description: '',
    };
  } else {
    screen = props.screens[props.currentScreenKey];

    deleteButton = Object.keys(props.screens).length > 1
      ? (
        <div style={styles.deleteRow}>
          <button
            onClick={deleteScreen}
            tabIndex="-1"
          >
            Delete this screen
          </button>
        </div>
      ) : null;
  }

  return (
    <PageModalWrapper
      {...props}
      title={props.mode === 'add' ? 'Add a screen' : 'Edit screen'}
      width={DIMENSIONS.SPACE_L * 7}
      showOk={true}
      okText={'Save'}
      onOk={upsertScreen}
    >
      <div>
        <input
          ref={el => nameEl = el}
          defaultValue={screen.name}
          style={styles.nameInput}
          autoFocus={true}
        />
      </div>

      <div>
        <textarea
          ref={el => descriptionEl = el}
          defaultValue={screen.description}
          style={styles.descInput}
        />
      </div>

      {deleteButton}
    </PageModalWrapper>
  );
};

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
