import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import {sendEvent} from '../../tracker.js';

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
  
  return (
    <button
      style={props.style}
      title={props.title}
      onClick={onButtonClick}
    >
      {props.children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
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
};

export default Radium(Button);
