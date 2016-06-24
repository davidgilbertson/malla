import React from 'react';
const {PropTypes} = React;
import sanitizeHtml from 'sanitize-html';

const cleanHtml = html => sanitizeHtml(html, {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'img', 'sup']),
});

const HtmlSnippet = props => <span dangerouslySetInnerHTML={{__html: cleanHtml(props.html)}} />;

HtmlSnippet.propTypes = {
  html: PropTypes.string.isRequired,
};

export default HtmlSnippet;
