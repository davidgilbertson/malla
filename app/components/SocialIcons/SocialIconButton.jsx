import React from 'react';
const {PropTypes} = React;

import {
  COLORS,
  DIMENSIONS,
} from '../../constants.js';

import {
  EVENTS,
} from '../../tracker.js';

import Button from '../Button/Button.jsx';
import Icon from '../Icon/Icon.jsx';

const SocialIconButton = props => (
  <Button
    style={{
      height: props.buttonHeight,
      color: COLORS.WHITE,
      marginLeft: DIMENSIONS.LAYOUT.HEADER_SPACING,
    }}
    title={props.title}
    category={EVENTS.CATEGORIES.UI_INTERACTION}
    action={props.action}
    label="Header button"
    onClick={props.onClick}
  >
    <Icon
      color={COLORS.WHITE}
      icon={props.icon}
      size={22}
    />
  </Button>
);

SocialIconButton.propTypes = {
  buttonHeight: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SocialIconButton;
