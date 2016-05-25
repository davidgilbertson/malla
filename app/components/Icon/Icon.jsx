import React from 'react';
const {PropTypes} = React;
import iconPaths from './iconPaths.js';

const Icon = props => {
  const path = iconPaths[props.icon];

  if (!path) {
    console.warn(`icon ${props.icon} does not exist.`);
    return null;
  }

  const styles = {
    svg: {
      display: 'inline-block',
      verticalAlign: 'middle',
    },
    path: {
      fill: props.color,
    },
  };

  return (
    <svg
      style={styles.svg}
      width={`${props.size}px`}
      height={`${props.size}px`}
      viewBox="0 -960 1024 1024"
    >
      <path
        transform="scale(1, -1)"
        style={styles.path}
        d={path}
      ></path>
    </svg>
  );
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};

Icon.defaultProps = {
  size: 16,
};

export default Icon;
