import React from 'react';
const {PropTypes} = React;

import PageModalWrapper from '../PageModalWrapper.jsx';

const style = {
  width: '100%',
  height: 160,
  padding: '3px 5px',
};

const FeedbackModal = props => {
  let feedbackEl;
  return (
    <PageModalWrapper
      {...props}
      title={'Send feedback'}
      showOk
      okText={'Send'}
      width={400}
      onOk={() => {
        if (feedbackEl.value) {
          props.sendFeedback(feedbackEl.value);
        }
      }}
    >
      <textarea
        ref={el => feedbackEl = el}
        autoFocus
        style={style}
        placeholder="What could we do better, what do you love?"
      />
    </PageModalWrapper>
  );
};

FeedbackModal.propTypes = {
  sendFeedback: PropTypes.func.isRequired,
};

export default FeedbackModal;
