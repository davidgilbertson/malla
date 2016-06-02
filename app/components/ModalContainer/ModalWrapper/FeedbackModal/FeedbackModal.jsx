import React from 'react';
const {Component, PropTypes} = React;

import Modal from '../Modal/Modal.jsx';

const styles = {
  textArea: {
    width: '100%',
    height: 160,
    padding: '3px 5px',
  },
};

class FeedbackModal extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.feedbackEl.focus();
  }
  
  render() {
    return (
      <Modal
        {...this.props}
        title="Send feedback"
        showOk={true}
        okText="Send"
        width={400}
        hideModal={() => {
          this.props.sendFeedback(this.feedbackEl.value);
          this.props.hideModal();
        }}
      >
        <textarea
          ref={el => this.feedbackEl = el}
          style={styles.textArea}
          placeholder="What could we do better, what do you love?"
        />
      </Modal>
    );
  }
}

FeedbackModal.propTypes = {
  sendFeedback: PropTypes.func.isRequired,
};

export default FeedbackModal;
