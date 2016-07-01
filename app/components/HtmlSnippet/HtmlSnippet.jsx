import React from 'react';
const {PropTypes} = React;
import sanitizeHtml from 'sanitize-html';

const cleanHtml = html => sanitizeHtml(html, {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'img', 'sup']),
});

const HtmlSnippet = props => (
  <span
    style={props.style}
    dangerouslySetInnerHTML={{__html: cleanHtml(props.html)}}
  />
);

HtmlSnippet.propTypes = {
  html: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default HtmlSnippet;
