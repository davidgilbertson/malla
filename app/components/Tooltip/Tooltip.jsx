import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';
import {connect} from 'react-redux';

import TextToolTooltip from './ToolTooltip/ToolTooltip.jsx';

import {
  COLORS,
  TOOLTIPS,
  Z_INDEXES,
} from '../../constants.js';

const styles = {
  back: {
    position: 'fixed',
    padding: 8,
    textAlign: 'center',
    color: COLORS.WHITE,
    background: COLORS.GRAY_DARK,
    zIndex: Z_INDEXES.TOOLTIP,
  },
  triangle: {
    position: 'absolute',
    top: -20,
    width: 20,
    height: 20,
    transform: 'translateX(-50%)',
    fontSize: 20,
    color: COLORS.GRAY_DARK,
    left: '50%',
  }
};

class Tooltip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let Child;

    switch (this.props.currentTooltip) {
      case TOOLTIPS.NONE:
        return null;

      case TOOLTIPS.TEXT:
      case TOOLTIPS.LABEL:
        Child = TextToolTooltip;
        break;

      default:
        return null;
    }

    return (
      <Child
        currentTooltip={this.props.currentTooltip}
        styles={styles}
        triangle={<div style={styles.triangle}>▲</div>}
      />
    );
  }
}

Tooltip.propTypes = {
  // state
  currentTooltip: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  return {
    currentTooltip: state.currentTooltip,
  };
};

export default connect(mapStateToProps)(Radium(Tooltip));
