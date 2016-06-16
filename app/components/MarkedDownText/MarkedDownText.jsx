import React from 'react';
const {PropTypes} = React;

import {
  markdownToHtml,
} from '../../utils';

const MarkedDownText = props => {
    if (props.doNotParseMarkdown) {
      return (
        <div
          style={{...props.style, whiteSpace: 'pre-line'}}
        >{props.markdown}</div>
      );
    }
    return (
      <div
        style={props.style}
        className="markdown-content" // App.jsx applies some rules to this
        dangerouslySetInnerHTML={{__html: markdownToHtml(props.markdown)}}
      ></div>
    );

}

MarkedDownText.propTypes = {
  markdown: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  doNotParseMarkdown: PropTypes.bool, // makes it simple to toggle formatting for boxes that are plain text only
};

export default MarkedDownText;
