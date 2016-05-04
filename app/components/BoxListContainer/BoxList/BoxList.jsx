import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';
import forOwn from 'lodash/forOwn';

import Box from './Box/Box.jsx';

const BoxList = ({boxes, boxActions}) => {
  const boxComponents = [];
  
  forOwn(boxes, (box, id) => {
    boxComponents.push(
      <Box
        key={id}
        id={id}
        box={box}
        boxActions={boxActions}
      />
    );
  });

  return (
    <div>
      {boxComponents}
    </div>
  )
};

BoxList.propTypes = {
  boxes: PropTypes.object.isRequired,
  boxActions: PropTypes.object.isRequired,
};

export default Radium(BoxList);
