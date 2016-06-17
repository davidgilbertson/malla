import React from 'react';
const {Component, PropTypes} = React;

class LimitedTextArea extends Component {
  constructor(props) {
    super(props);
    
    this.focus = this.focus.bind(this);
    this.setValue = this.setValue.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  
  focus() {
    this.textAreaEl.focus();
  }
  
  setValue(value) {
    this.textAreaEl.value = value;
  }

  onChange() {
    let {value} = this.textAreaEl;
    const onChangePayload = {
      value,
      tooLong: false,
      tooLongMessage: '',
    };
    
    if (this.props.restrictInput) {
      // don't use the native maxLength attribute because we want to announce when we limit it
      if (this.props.maxLength && value.length > this.props.maxLength) {
        value = value.substr(0, this.props.maxLength);
        this.textAreaEl.value = value;
        this.props.onTextLimited();
      }

      onChangePayload.value = value;
    } else {
      // for boxes that aren't restricted
      const lengthDelta = value.length - this.props.maxLength;
  
      if (this.props.maxLength && lengthDelta > 0) {
        onChangePayload.tooLong = true;
        onChangePayload.tooLongMessage = `Too long by ${lengthDelta} character${lengthDelta === 1 ? '' : 's'}`;
      }
    }
    
    this.props.onChange(onChangePayload);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.maxLength !== this.props.maxLength) {
      // re-trigger the messages if the max-length changes
      this.onChange();
    }
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
      />
    );
  }
}

LimitedTextArea.propTypes = {
  // props
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  maxLength: PropTypes.number,
  style: PropTypes.object,
  restrictInput: PropTypes.bool, // don't allow there to be more that the limit

  // methods
  onChange: PropTypes.func,
  onTextLimited: PropTypes.func,
};

LimitedTextArea.defaultProps = {
  maxLength: 0,
  restrictInput: false,
};

export default LimitedTextArea;
