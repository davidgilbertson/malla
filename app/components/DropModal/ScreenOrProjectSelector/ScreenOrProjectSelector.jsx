import React from 'react';
const {PropTypes} = React;

import DropModalWrapper from '../DropModalWrapper.jsx';
import Button from '../../Button/Button.jsx';
import Icon from '../../Icon/Icon.jsx';

import {
  COLORS,
  DIMENSIONS,
  ELEMENT_IDS,
  ICONS,
  ITEM_TYPES,
  MODALS,
} from '../../../constants.js';

import {
  makeArray,
} from '../../../utils';

const ScreenOrProjectSelector = props => {
  const currentProjectKey = props.screens[props.currentScreenKey].projectKey;

  let options;
  if (props.itemType === ITEM_TYPES.SCREEN) {
    options = {
      listTitle: 'Screens',
      itemArray: makeArray(props.screens).filter(screen => screen.projectKey === currentProjectKey),
      title: 'Edit this screen',
      currentKey: props.currentScreenKey,
      onAdd: () => {
        props.hideDropModal();
        props.showModal(MODALS.ADD_SCREEN);
      },
      onSelect: key => {
        props.navigateToScreen(key);
      },
      onEdit: key => {
        props.navigateToScreen(key);
        props.showModal(MODALS.EDIT_SCREEN);
      },
      addItemModal: MODALS.ADD_SCREEN,
      addItemText: 'Add a screen',
      dropModalElementId: ELEMENT_IDS.SCREEN_SELECTOR_BUTTON,
    };
  } else if (props.itemType === ITEM_TYPES.PROJECT) {
    options = {
      listTitle: 'Projects',
      itemArray: makeArray(props.projects),
      title: 'Edit this project',
      currentKey: currentProjectKey,
      onAdd: () => {
        props.hideDropModal();
        props.showModal(MODALS.ADD_PROJECT);
      },
      onSelect: key => {
        props.navigateToProject(key);
      },
      onEdit: key => {
        props.navigateToProject(key);
        props.showModal(MODALS.EDIT_PROJECT);
      },
      addItemModal: MODALS.ADD_PROJECT,
      addItemText: 'Add a project',
      dropModalElementId: ELEMENT_IDS.PROJECT_SELECTOR_BUTTON,
    };
  } else {
    return null;
  }

  const styles = {
    back: {
      padding: 0,
    },
    title: {
      height: DIMENSIONS.SPACE_L,
      paddingTop: 19,
      borderBottom: `1px solid ${COLORS.WHITE}`,
      textTransform: 'uppercase',
      fontSize: 19,
    },
    listItem: {
      height: DIMENSIONS.SPACE_M,
      textAlign: 'left',
      padding: '6px',
      cursor: 'pointer',
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    listItemName: {
      textAlign: 'left',
      flex: '1 1 auto',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textTransform: 'none',
    },
    listItemGear: {
      color: COLORS.WHITE,
      flex: '0 0 auto',
      opacity: 0.5,
      marginTop: '-3px',
    },
    addNew: {
      margin: `${DIMENSIONS.SPACE_M}px auto`,
      padding: 8,
      width: DIMENSIONS.SPACE_L * 3,
      backgroundColor: COLORS.WHITE,
      color: COLORS.GRAY_DARK,
      fontWeight: 400,
    }
  };
  
  const renderList = () => {
    return options.itemArray
      .filter(item => !item.deleted)
      .map(item => {
        const style = {...styles.listItem};

        if (item._key === options.currentKey) {
          style.backgroundColor = COLORS.PRIMARY;
          style.borderBottom = `1px solid ${COLORS.PRIMARY_LIGHT}`;
          style.borderTop = `1px solid ${COLORS.PRIMARY_LIGHT}`;
        }

        return (
          <div
            key={item._key}
            style={style}
            onClick={props.hideDropModal}
          >
            <button
              style={styles.listItemName}
              title={item.description}
              onClick={() => options.onSelect(item._key)}
            >{item.name}</button>

            <button
              style={styles.listItemGear}
              title={options.title}
              onClick={() => options.onEdit(item._key)}
            >
              <Icon
                icon={ICONS.GEAR}
                size={20}
                color={styles.listItemGear.color}
              />
            </button>
          </div>
        );
      });
  };

  return (
    <DropModalWrapper
      {...props}
      modalStyle={styles.back}
      centerOnElementId={options.dropModalElementId}
      hideOnAnyClick={true}
    >
      <h2 style={styles.title}>{options.listTitle}</h2>

      {renderList()}

      <Button
        style={styles.addNew}
        onClick={options.onAdd}
      >{options.addItemText}</Button>
    </DropModalWrapper>
  );
};

ScreenOrProjectSelector.propTypes = {
  // props
  currentScreenKey: PropTypes.string.isRequired,
  itemType: PropTypes.oneOf([
    ITEM_TYPES.SCREEN,
    ITEM_TYPES.PROJECT,
  ]),
  screens: PropTypes.object,
  projects: PropTypes.object,

  // functions
  navigateToScreen: PropTypes.func.isRequired,
  navigateToProject: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  hideDropModal: PropTypes.func.isRequired,
};

export default ScreenOrProjectSelector;
