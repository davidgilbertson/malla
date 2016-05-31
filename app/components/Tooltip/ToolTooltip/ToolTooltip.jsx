import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import {
  ELEMENT_IDS,
  DIMENSIONS,
  TOOLTIPS,
} from '../../../constants.js';

import {
  css,
} from '../../../utils';

const ToolTooltip = props => {
  let body = null;
  let anchorEl;

  const styles = {
    back: {
      width: DIMENSIONS.SPACE_L * 4,
      ...css.shadow('small'),
    }
  };

  if (props.currentTooltip === TOOLTIPS.TEXT) {
    body = <div>Add text that you want to use in your website or app</div>;
    anchorEl = document.getElementById(`${ELEMENT_IDS.TEXT_TOOL}`);
  }

  if (props.currentTooltip === TOOLTIPS.LABEL) {
    body = <div>Add labels that are only visible in Malla</div>;
    anchorEl = document.getElementById(`${ELEMENT_IDS.LABEL_TOOL}`);
  }

  const anchorDims = anchorEl.getBoundingClientRect();
  styles.back.left = anchorDims.left + anchorDims.width / 2 - styles.back.width / 2;
  styles.back.top = anchorDims.top + anchorDims.height + 13;

  return (
    <div
      style={[props.styles.back, styles.back]}
    >
      {props.triangle}
      {body}
    </div>
  )
};

ToolTooltip.propTypes = {
  currentTooltip: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
  triangle: PropTypes.object,
};

export default Radium(ToolTooltip);
