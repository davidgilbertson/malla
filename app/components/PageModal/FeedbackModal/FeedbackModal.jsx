import React from 'react';
const {Component, PropTypes} = React;

import PageModalWrapper from '../PageModalWrapper.jsx';

const style = {
  width: '100%',
  height: 160,
  padding: '3px 5px',
};

class FeedbackModal extends Component {
  componentDidMount() {
    this.feedbackEl.focus();
  }
  
  render() {
    return (
      <PageModalWrapper
        {...this.props}
        title={'Send feedback'}
        showOk={true}
        okText={'Send'}
        width={400}
        onOk={() => {
          if (this.feedbackEl.value) {
            this.props.sendFeedback(this.feedbackEl.value);
          }
        }}
      >
        <textarea
          ref={el => this.feedbackEl = el}
          style={style}
          placeholder="What could we do better, what do you love?"
        />
      </PageModalWrapper>
    );
  }
}

FeedbackModal.propTypes = {
  sendFeedback: PropTypes.func.isRequired,
};

export default FeedbackModal;
