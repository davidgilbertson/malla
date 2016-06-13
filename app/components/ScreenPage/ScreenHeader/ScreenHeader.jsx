import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import Button from '../../Button/Button.jsx';
import Icon from '../../Icon/Icon.jsx';

import {
  BREAKPOINTS,
  COLORS,
  DIMENSIONS,
  DROP_MODALS,
  ELEMENT_IDS,
  ICONS,
  MODALS,
  TOOLS,
  Z_INDEXES,
} from '../../../constants.js';

import {
  css,
} from '../../../utils';

import {EVENTS} from '../../../tracker.js';

const tools = [
  {
    elementId: ELEMENT_IDS.TEXT_TOOL,
    name: 'Text',
    icon: ICONS.T,
    code: TOOLS.TEXT,
  },
  {
    elementId: ELEMENT_IDS.LABEL_TOOL,
    name: 'Labels',
    icon: ICONS.LABEL,
    code: TOOLS.LABEL,
  }
];

const ScreenHeader = props => {
  const styles = {
    header: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: DIMENSIONS.SPACE_L,
      backgroundColor: COLORS.OFF_WHITE,
      padding: '0 12px',
      ...css.shadow('small'),
      zIndex: Z_INDEXES.SCREEN_HEADER,
    },
    projectOrScreenButton: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    toolButtons: {
      display: 'flex',
      flexFlow: 'row',
    },
    toolButton: {
      height: DIMENSIONS.SPACE_M,
      width: DIMENSIONS.SPACE_M,
      border: `1px solid ${COLORS.GRAY_LIGHT}`,
      color: COLORS.GRAY,
      [BREAKPOINTS.TABLET_LANDSCAPE]: {
        width: DIMENSIONS.SPACE_L * 2,
      },
    },
    toolButtonIconWrapper: {
      position: 'relative',
      top: -2,
    },
    toolButtonText: {
      marginLeft: 20,
      textAlign: 'center',
      display: 'none',
      [BREAKPOINTS.TABLET_LANDSCAPE]: {
        display: 'inline-block',
      },
    },
    apiButton: {
      backgroundColor: COLORS.PRIMARY,
      color: COLORS.WHITE,
      padding: '8px 12px',
    },
  };

  const currentScreen = props.screens[props.currentScreenKey];

  if (!currentScreen) {
    // When there is a large number of screens, this state may occur before the screens are all loaded
    return <div style={styles.header}></div>;
  }

  const currentProject = props.projects[currentScreen.projectKey];

  const renderToolButtons = tools => tools.map(tool => {
    let style = styles.toolButton;

    if (tool.code === props.currentTool) {
      style = {
        ...styles.toolButton,
        backgroundColor: COLORS.ACCENT,
        color: COLORS.WHITE,
        border: `1px solid ${COLORS.ACCENT}`,
      }
    }

    return (
      <button
        id={tool.elementId}
        key={tool.code}
        style={style}
        onClick={() => {
          props.selectTool(tool.code);
        }}
        onMouseEnter={() => {
          props.showDropModal(tool.code);
        }}
        onMouseLeave={() => {
          props.showDropModal(null);
        }}
      >
        <span style={styles.toolButtonIconWrapper}>
          <Icon
            color={style.color}
            size={18}
            icon={tool.icon}
          />
        </span>
        <span style={styles.toolButtonText}>
          {tool.name}
        </span>
      </button>
    );
  });

  return (
    <div style={styles.header}>
      <div>
        <Button
          id={ELEMENT_IDS.PROJECT_SELECTOR_BUTTON}
          onClick={() => {}}
        >
          {currentProject.name}
        </Button>

        <span> / </span>

        <Button
          style={styles.projectOrScreenButton}
          id={ELEMENT_IDS.SCREEN_SELECTOR_BUTTON}
          onClick={() => {
            props.showDropModal(DROP_MODALS.SCREEN_SELECTOR);
          }}
        >
          {currentScreen.name} ▼
        </Button>
      </div>

      <div style={styles.toolButtons}>
        {renderToolButtons(tools)}
      </div>

      <div>
        <Button
          key="exportData"
          style={styles.apiButton}
          category={EVENTS.CATEGORIES.UI_INTERACTION}
          action={EVENTS.ACTIONS.CLICKED.EXPORT_DATA}
          label="Screen header button"
          onClick={() => {
            props.showModal(MODALS.EXPORT_DATA);
          }}
        >
          <span style={css.showForPhoneOnly()}>{MALLA_TEXT.apiButtonShort}</span>
          <span style={css.showForTabletPortraitUp()}>{MALLA_TEXT.apiButtonLong}</span>
        </Button>
      </div>
    </div>
  );
};

ScreenHeader.propTypes = {
  // state
  currentScreenKey: PropTypes.string.isRequired,
  screens: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,

  // actions
  showModal: PropTypes.func.isRequired,
  showDropModal: PropTypes.func.isRequired,
};

export default Radium(ScreenHeader);
