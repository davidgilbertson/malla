import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';

import {
  ELEMENT_IDS,
  DIMENSIONS,
  TOOLS,
} from '../../../constants.js';

import {
  css,
} from '../../../utils';

class ToolTooltip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let body = null;
    let anchorEl;

    const styles = {
      back: {
        width: DIMENSIONS.SPACE_L * 3,
        ...css.shadow('small'),
      }
    };

    if (this.props.currentTooltip === TOOLS.TEXT) {
      body = <div>Add text that you want to use in your website or app</div>;
      anchorEl = document.getElementById(`${ELEMENT_IDS.TEXT_TOOL}`);
    }

    if (this.props.currentTooltip === TOOLS.LABEL) {
      body = <div>Add labels that are only visible in Malla</div>;
      anchorEl = document.getElementById(`${ELEMENT_IDS.LABEL_TOOL}`);
    }

    const anchorDims = anchorEl.getBoundingClientRect();
    styles.back.left = anchorDims.left + anchorDims.width / 2 - styles.back.width / 2;
    styles.back.top = anchorDims.top + anchorDims.height + 13;

    return (
      <div
        style={[this.props.styles.back, styles.back]}
      >
        {this.props.triangle}
        {body}
      </div>
    )
  }
}

ToolTooltip.propTypes = {
  currentTooltip: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
  triangle: PropTypes.object,
};

export default Radium(ToolTooltip);
