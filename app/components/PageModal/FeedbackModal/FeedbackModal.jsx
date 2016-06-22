import React from 'react';
const {PropTypes} = React;

import PageModalWrapper from '../PageModalWrapper.jsx';
import TextArea from '../../TextArea/TextArea.jsx';

const style = {
  width: '100%',
  height: 160,
  padding: '3px 5px',
};

const FeedbackModal = props => {
  let feedbackComp;

  const sendFeedback = () => {
    const feedback = feedbackComp.getValue();

    if (feedback) {
      props.sendFeedback(feedback);
    }

    props.hideModal();
  };

  return (
    <PageModalWrapper
      {...props}
      title={'Send feedback'}
      showOk
      okText={'Send'}
      width={400}
      onOk={sendFeedback}
    >
      <TextArea
        ref={comp => feedbackComp = comp}
        autoFocus
        style={style}
        placeholder="What could we do better, what do you love?"
        onCtrlEnter={sendFeedback}
      />
    </PageModalWrapper>
  );
};

FeedbackModal.propTypes = {
  sendFeedback: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default FeedbackModal;
