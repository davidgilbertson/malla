import React from 'react';
const {PropTypes} = React;

import {
  css,
} from '../../utils';

const Avatar = props => {
  const style = {
    ...css.squareImage({
      url: props.url,
      size: props.size,
    }),
    ...props.style,
  };

  return <div style={style}></div>;
};

Avatar.propTypes = {
  size: PropTypes.number,
  style: PropTypes.object,
  url: PropTypes.string.isRequired,
};

export default Avatar;
