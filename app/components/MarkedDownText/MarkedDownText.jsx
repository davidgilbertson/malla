import React from 'react';
const {PropTypes} = React;

import {
  markdownToHtml,
} from '../../utils';

const MarkedDownText = props => (
  <div
    {...props}
    className="markdown-content" // App.jsx applies some rules to this
    dangerouslySetInnerHTML={{__html: markdownToHtml(props.markdown)}}
  ></div>
);

MarkedDownText.propTypes = {
  markdown: PropTypes.string,
};

export default MarkedDownText;
