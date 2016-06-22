import React from 'react';
const {Component, PropTypes} = React;

import {
  KEYS,
} from '../../constants.js';

class TextArea extends Component {
  constructor(props) {
    super(props);

    this.focus = this.focus.bind(this);
    this.setValue = this.setValue.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  onChange() {
    const {props} = this;
    let {value} = this.textAreaEl;

    if (props.restrictInput && props.maxLength && value.length > props.maxLength) {
      value = value.substr(0, props.maxLength);
      this.textAreaEl.value = value;
      props.onTextLimited();
    }

    props.onChange(value);
  }

  onKeyUp(e) {
    const ctrlEnter = e.keyCode === KEYS.ENTER && (e.ctrlKey || e.metaKey); // meta === cmd on OSX

    if (this.props.onCtrlEnter && ctrlEnter) {
      this.props.onCtrlEnter();
    }

    if (this.props.onEsc && e.keyCode === KEYS.ESC) {
      this.props.onEsc();
    }
  }

  setValue(value) {
    this.textAreaEl.value = value;
  }

  getValue() {
    return this.textAreaEl.value;
  }

  focus() {
    this.textAreaEl.focus();
  }

  render() {
    const {props} = this;
    return (
      <textarea
        ref={el => this.textAreaEl = el}
        style={props.style}
        defaultValue={props.defaultValue}
        value={props.value}
        onChange={this.onChange}
        onKeyUp={this.onKeyUp}
        autoFocus={props.autoFocus}
        placeholder={props.placeholder}
      />
    );
  }
}

TextArea.propTypes = {
  // props
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  style: PropTypes.object,
  restrictInput: PropTypes.bool, // don't allow there to be more that the limit
  autoFocus: PropTypes.bool,
  limit: PropTypes.bool, // if false, this behaves as a normal textarea, else limiting logic happens

  // methods
  onChange: PropTypes.func,
  onTextLimited: PropTypes.func,
  onCtrlEnter: PropTypes.func,
  onEsc: PropTypes.func,
};

TextArea.defaultProps = {
  maxLength: 0,
  restrictInput: false,
  onChange: () => {},
};

export default TextArea;
