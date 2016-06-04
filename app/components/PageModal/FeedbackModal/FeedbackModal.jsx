import React from 'react';
const {Component, PropTypes} = React;

const style = {
  width: '100%',
  height: 160,
  padding: '3px 5px',
};

class FeedbackModal extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.feedbackEl.focus();

    this.props.setModalState({
      title: 'Send feedback',
      showOk: true,
      okText: 'Send',
      width: 400,
      onOk: () => {
        if (this.feedbackEl.value) {
          this.props.sendFeedback(this.feedbackEl.value);
        }
      },
    });
  }
  
  render() {
    return (
      <textarea
        ref={el => this.feedbackEl = el}
        style={style}
        placeholder="What could we do better, what do you love?"
      />
    );
  }
}

FeedbackModal.propTypes = {
  sendFeedback: PropTypes.func.isRequired,
  setModalState: PropTypes.func.isRequired,
};

export default FeedbackModal;
