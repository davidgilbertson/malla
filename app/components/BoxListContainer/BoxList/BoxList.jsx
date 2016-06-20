import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';
import isEqual from 'lodash/isEqual';

import {
  makeArray,
} from '../../../utils';

import Box from './Box/Box.jsx';

class BoxList extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(nextProps.boxes, this.props.boxes) ||
      !isEqual(nextProps.currentTool, this.props.currentTool) ||
      !isEqual(nextProps.currentScreenKey, this.props.currentScreenKey) ||
      !isEqual(nextProps.activeBox, this.props.activeBox)
    );
  }

  render() {
    const {props} = this;

    const boxComponents = makeArray(props.boxes)
      .filter(box => box && !box.deleted && box.screenKeys[props.currentScreenKey])
      .map(box => {
        return (
          <Box
            {...props}
            key={box._key}
            id={box._key}
            box={box}
          />
        );
      });

    return (
      <div>
        {boxComponents}
      </div>
    );
  }
}

BoxList.propTypes = {
  // props
  activeBox: PropTypes.object.isRequired,
  boxes: PropTypes.object.isRequired,
  currentScreenKey: PropTypes.string.isRequired,
  currentTool: PropTypes.string.isRequired,
};

export default Radium(BoxList);
