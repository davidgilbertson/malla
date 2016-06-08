import React from 'react';
const {PropTypes} = React;
import sanitizeHtml from 'sanitize-html';

const HtmlSnippet = props => <span dangerouslySetInnerHTML={{__html: sanitizeHtml(props.html)}}/>;

HtmlSnippet.propTypes = {
  html: PropTypes.string.isRequired,
};

export default HtmlSnippet;
