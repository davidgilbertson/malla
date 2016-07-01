import React from 'react';
const {Component, PropTypes} = React;

import {
  KEYS,
} from '../../constants.js';

class Input extends Component {
  constructor(props) {
    super(props);

    this.onKeyUp = this.onKeyUp.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getTypedValue = this.getTypedValue.bind(this);
  }

  onKeyUp(e) {
    if (!this.props.onEnter) return;
    if (e.keyCode === KEYS.ENTER) this.props.onEnter();
  }

  onChange(e) {
    this.props.onChange(this.getTypedValue(e.target.value));
  }

  getTypedValue(val) {
    if (this.props.type === 'number') {
      return isFinite(val) ? Number(val) : val;
    }

    return val;
  }

  getValue() {
    return this.getTypedValue(this.inputEl.value);
  }

  setValue(value) {
    this.inputEl.value = value || '';
  }

  render() {
    const {props} = this;

    return (
      <input
        ref={el => this.inputEl = el}
        id={props.id}
        type={props.type}
        title={props.title}
        onKeyUp={this.onKeyUp}
        defaultValue={props.defaultValue}
        value={props.value}
        style={props.style}
        min={props.min}
        onChange={this.onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        autoFocus={props.autoFocus}
        disabled={props.disabled}
        spellCheck={props.spellCheck}
        placeholder={props.placeholder}
      />
    );
  }
}

Input.propTypes = {
  // props
  type: PropTypes.string,
  id: PropTypes.string,
  title: PropTypes.string,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  spellCheck: PropTypes.bool,
  style: PropTypes.object,
  min: PropTypes.string,
  placeholder: PropTypes.string,

  // functions
  onEnter: PropTypes.func,
  onChange: PropTypes.func,
};

Input.defaultProps = {
  spellCheck: true,
  onChange: () => {},
};

export default Input;
