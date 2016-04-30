import React from 'react';
const {PropTypes} = React;
// import Radium from 'radium';

import Box from '../Box/Box.jsx';

const BoxList = ({boxes, selectBox}) => {
  const boxComponents = boxes.map(box => (
      <Box
        key={box.id}
        box={box}
        selectBox={selectBox}
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
};

export default BoxList;
// export default Radium(BoxList);
