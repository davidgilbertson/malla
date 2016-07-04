import React from 'react';
const {PropTypes} = React;

import {
  API_TEXT_FORMATS,
  COLORS,
} from '../../constants.js';

const styles = {
  formatOptions: {
    marginTop: 10,
  },
  formatOptionLabel: {
    display: 'block',
    fontSize: 15,
    marginTop: 5,
    cursor: 'pointer',
  },
  apiUrlWrapper: {
    marginTop: 30,
  },
  apiUrl: {
    color: COLORS.ACCENT,
    fontWeight: 400,
  },
};

const ApiAccessSettings = props => {
  const updateProject = newProps => {
    props.updateProject(
      props.project.key,
      newProps,
    );
  };

  const apiTextFormat = props.project.val.apiTextFormat || API_TEXT_FORMATS.HTML;

  const queryParams = apiTextFormat !== API_TEXT_FORMATS.HTML
    ? `?format=${apiTextFormat}`
    : ''; // html is the default

  const apiUrl = `${location.origin}/api/${props.project.key}.json${queryParams}`;

  const apiLink = (
    <a
      style={styles.apiUrl}
      href={apiUrl}
      target="_blank"
    >{apiUrl}</a>
   );

  return (
    <div>
      <p>How would you like the text to be formatted?</p>

      <div style={styles.formatOptions}>
        <label style={styles.formatOptionLabel}>
          <input
            type="radio"
            name="outputOption"
            checked={apiTextFormat === API_TEXT_FORMATS.HTML}
            onChange={() => updateProject({apiTextFormat: API_TEXT_FORMATS.HTML})}
            autoFocus
          />

          HTML (ready for use in a website)
        </label>

        <label style={styles.formatOptionLabel}>
          <input
            type="radio"
            name="outputOption"
            checked={apiTextFormat === API_TEXT_FORMATS.RAW}
            onChange={() => updateProject({apiTextFormat: API_TEXT_FORMATS.RAW})}
          />

          Plain text (if you have used markdown for formatting you will need to parse this yourself)
        </label>
      </div>

      <p style={styles.apiUrlWrapper}>Your API endpoint is: {apiLink}</p>
    </div>
  );
};

ApiAccessSettings.propTypes = {
  // props
  project: PropTypes.object.isRequired,

  // methods
  updateProject: PropTypes.func.isRequired,
};

export default ApiAccessSettings;
