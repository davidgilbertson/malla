import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import {
  makeArray,
} from '../../../utils';

import Box from './Box/Box.jsx';

const BoxList = props => {
  // TODO (davidg): filter for boxes in this project/screen only

  const boxComponents = makeArray(props.boxes)
    .filter(box => box && !box.deleted && box.screenKeys[props.currentScreenKey])
    .map(box => {
      return (
        <Box
          key={box._key}
          id={box._key}
          box={box}
          boxActions={props.boxActions}
          currentTool={props.currentTool}
          activeBox={props.activeBox}
          showModal={props.showModal}
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
  // state
  boxes: PropTypes.object.isRequired,
  currentTool: PropTypes.string.isRequired,
  currentScreenKey: PropTypes.string.isRequired,
  activeBox: PropTypes.object.isRequired,

  // actions
  boxActions: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired,
};

export default Radium(BoxList);
