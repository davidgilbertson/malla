import React from 'react';
const {PropTypes} = React;
import slug from 'speakingurl';

import PageModalWrapper from '../PageModalWrapper.jsx';
import Input from '../../Input/Input.jsx';
import TextArea from '../../TextArea/TextArea.jsx';

import {
  BOX_TYPES,
  COLORS,
  DIMENSIONS,
  TEXT_PADDING,
} from '../../../constants.js';

import {
  css,
  getCurrentProjectAndScreen,
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
  let nameComp;
  let descriptionComp;
  const {currentProject} = getCurrentProjectAndScreen();

  const upsertScreenAndClose = () => {
    const name = nameComp.getValue();
    const description = descriptionComp.getValue();

    if (name) {
      if (props.mode === 'add') {
        props.addScreen({
          name,
          slug: slug(name),
          description,
        });
      } else {
        props.updateScreen(props.currentScreenKey, {
          name,
          slug: slug(name),
          description,
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

  const renderDeleteButton = () => {
    if (props.mode === 'add') return null;

    const screensInProject = makeArray(props.screens)
      .filter(screen => !screen.deleted && screen.projectKey === currentProject.key);

    if (screensInProject.length <= 1) return null;

    return (
      <div style={styles.deleteRow}>
        <button
          onClick={deleteScreen}
          tabIndex="-1"
        >
          Delete this screen
        </button>
      </div>
    );
  };

  const screen = props.mode === 'add'
    ? {name: '', description: ''}
    : props.screens[props.currentScreenKey];

  return (
    <PageModalWrapper
      {...props}
      title={props.mode === 'add' ? 'Add a screen' : 'Edit screen'}
      width={DIMENSIONS.SPACE_L * 7}
      showOk
      okText={'Save'}
      onOk={upsertScreenAndClose}
    >
      <div>
        <Input
          ref={comp => nameComp = comp}
          defaultValue={screen.name}
          style={styles.nameInput}
          onEnter={upsertScreenAndClose}
          autoFocus
        />
      </div>

      <div>
        <TextArea
          ref={comp => descriptionComp = comp}
          defaultValue={screen.description}
          style={styles.descInput}
          onCtrlEnter={upsertScreenAndClose}
        />
      </div>

      {renderDeleteButton()}
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
  hideModal: PropTypes.func.isRequired,
};

export default ScreenDetails;
