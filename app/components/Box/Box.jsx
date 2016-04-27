import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import css from '../../utils/css';
import {
  ANIMATION_DURATION,
  COLORS,
} from '../../utils/constants';

const Box = ({box, selectBox}) => {
  const boxStyle = {
    position: 'absolute',
    left: box.left,
    top: box.top,
    width: box.width,
    height: box.height,
    ...css.border(1, 'dashed', COLORS.GRAY_LIGHT),
    padding: 10,
    cursor: 'pointer',
    transition: `${ANIMATION_DURATION}ms`,
    ':hover': {
      borderColor: COLORS.GRAY,
    },
  };

  const selectedBoxStyle = {
    background: COLORS.WHITE,
    ...css.border(1, 'solid', COLORS.GRAY),
    ...css.shadow('large'),
    ':hover': {
      ...css.border(1, 'solid', COLORS.GRAY),
    },
  };

  return (
    <div
      key={box.id}
      style={[boxStyle, box.selected && selectedBoxStyle]}
      onClick={() => selectBox(box.id)}
    >
      {box.name}
    </div>
  );
};

Box.propTypes = {
  box: PropTypes.object.isRequired,
  selectBox: PropTypes.func.isRequired,
};

export default Radium(Box);
