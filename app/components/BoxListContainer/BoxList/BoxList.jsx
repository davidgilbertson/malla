import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';
import forOwn from 'lodash/forOwn';

import Box from './Box/Box.jsx';

const BoxList = (props) => {
  const boxComponents = [];
  // TODO (davidg): filter for boxes in this project/screen only
  
  forOwn(props.boxes, (box, id) => {
    if (box) {
      boxComponents.push(
        <Box
          key={id}
          id={id}
          box={box}
          boxActions={props.boxActions}
          currentTool={props.currentTool}
          activeBox={props.activeBox}
        />
      );
    }
  });

  return (
    <div>
      {boxComponents}
    </div>
  )
};

BoxList.propTypes = {
  // state
  boxes: PropTypes.object.isRequired,
  currentTool: PropTypes.string.isRequired,
  activeBox: PropTypes.object.isRequired,

  // actions
  boxActions: PropTypes.object.isRequired,
};

export default Radium(BoxList);
