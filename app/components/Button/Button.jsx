import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import {sendEvent} from '../../tracker.js';

import {
  COLORS,
} from '../../constants.js';

const Button = (props) => {
  const onButtonClick = () => {
    if (props.category && props.action) {
      sendEvent({
        category: props.category,
        action: props.action,
        label: props.label,
        value: props.value,
      });
    }

    props.onClick();
  };

  const style = {...props.style};

  if (props.disabled) {
    style.backgroundColor = COLORS.GRAY;
    style.cursor = 'default';
  }

  return (
    <button
      id={props.id}
      style={style}
      title={props.title}
      onClick={onButtonClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

Button.propTypes = {
  // props
  id: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  category: PropTypes.string,
  action: PropTypes.string,
  label: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.number,
  disabled: PropTypes.bool,

  // actions
  onClick: PropTypes.func.isRequired,
};

export default Radium(Button);
