import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import Button from '../../Button/Button.jsx';
import Icon from '../../Icon/Icon.jsx';
import {
  COLORS,
  DIMENSIONS,
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
    name: 'Text',
    icon: ICONS.T,
    code: TOOLS.TEXT,
  },
  {
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
      background: COLORS.OFF_WHITE,
      padding: '0 12px',
      ...css.shadow('small'),
      zIndex: Z_INDEXES.SCREEN_HEADER,
    },
    toolButtons: {
      display: 'flex',
      flexFlow: 'row',
    },
    toolButton: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: DIMENSIONS.SPACE_M,
      width: 120,
      border: `1px solid ${COLORS.GRAY_LIGHT}`,
      color: COLORS.GRAY,
      ':focus': {
        outline: 'none'
      }
    },
    toolButtonIconWrapper: {
      position: 'relative',
      top: -2,
      flex: 2,
    },
    toolButtonText: {
      flex: 6,
      textAlign: 'center',
    },
    apiButton: {
      background: COLORS.PRIMARY,
      color: COLORS.WHITE,
      padding: '8px 12px',
    },
  };

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
        key={tool.code}
        style={style}
        onClick={() => {
        props.selectTool(tool.code);
      }}
      >
        <div style={styles.toolButtonIconWrapper}>
          <Icon
            color={style.color}
            size={18}
            icon={tool.icon}
          />
        </div>
        <div style={styles.toolButtonText}>
          {tool.name}
        </div>
      </button>
    );
  });

  return (
    <div style={styles.header}>
      <div>
        Project 1 / Screen 1
      </div>

      {/*
      <div style={styles.toolButtons}>
        {renderToolButtons(tools)}
      </div>
      */}

      <div>
        <Button
          key="exportData"
          style={styles.apiButton}
          category={EVENTS.CATEGORIES.UI_INTERACTION}
          action={EVENTS.ACTIONS.CLICKED.EXPORT_DATA}
          label="Screen header button"
          onClick={() => {
          console.log('  --  >  ScreenHeader.jsx:129 > ');
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
  showModal: PropTypes.func.isRequired,
};

export default Radium(ScreenHeader);
