import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import {
  COLORS,
} from '../../constants.js';

const styles = {
  button: {
    background: COLORS.PRIMARY,
    color: COLORS.WHITE,
    padding: 12,
    minWidth: 100,
  },
};

const Button = ({additionalStyles, children, onClick}) => (
  <button
    style={[styles.button, additionalStyles]}
    onClick={onClick}
  >
    {children}
  </button>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  additionalStyles: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
};

export default Radium(Button);
