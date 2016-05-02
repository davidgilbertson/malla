import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import Box from '../Box/Box.jsx';

const BoxList = ({boxes, boxActions}) => {
  const boxComponents = boxes.map(box => (
      <Box
        key={box.id}
        box={box}
        boxActions={boxActions}
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
  boxActions: PropTypes.object.isRequired,
};

export default Radium(BoxList);
