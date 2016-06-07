import React from 'react';
const {PropTypes} = React;
const md = require('markdown-it')();

md.use(require('markdown-it-sup'));
md.use(require('markdown-it-sub'));

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
