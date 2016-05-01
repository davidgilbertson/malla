import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import Box from '../Box/Box.jsx';

const BoxList = ({boxes, selectBox, updateBox}) => {
  const boxComponents = boxes.map(box => (
      <Box
        key={box.id}
        box={box}
        selectBox={selectBox}
        updateBox={updateBox}
      />
  ));
  return (
    <div>
      {boxComponents}
    </div>
  )
};

BoxList.propTypes = {
  boxes: PropTypes.array.isRequired,
  selectBox: PropTypes.func.isRequired,
  updateBox: PropTypes.func.isRequired,
};

export default Radium(BoxList);
