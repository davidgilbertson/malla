import React from 'react';
const {PropTypes} = React;

import {
  API_TEXT_FORMATS,
  COLORS,
} from '../../constants.js';

import {
  css,
} from '../../utils';

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
  apiKeyText: {
    marginTop: 5,
    color: COLORS.GRAY_LIGHT,
  },
  apiKeyNote: {
    fontSize: 15,
    fontStyle: 'italic',
    marginTop: 5,
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
  const requireApiKey = props.project.val.requireApiKey;
  const apiKey = props.project.val.apiKey;
  const apiKeyText = requireApiKey ? `API key: ${apiKey}` : '';

  const queryParamPairs = [];

  if (apiTextFormat !== API_TEXT_FORMATS.HTML) {
    queryParamPairs.push(`format=${apiTextFormat}`);
  }

  if (requireApiKey) {
    queryParamPairs.push(`key=${apiKey}`);
  }

  const queryParamString = queryParamPairs.length ? `?${queryParamPairs.join('&')}` : '';

  const apiUrl = `${location.origin}/api/${props.project.key}.json${queryParamString}`;

  const apiKeyNote = requireApiKey ? (
    <p style={styles.apiKeyNote}>
      You should only connect to the URL below from a private server.
      Do not use this key where the public can see it (e.g. in code that gets sent to the browser).
    </p>
  ) : null;

  const apiLink = (
    <a
      style={styles.apiUrl}
      href={apiUrl}
      target="_blank"
    >{apiUrl}</a>
   );

  return (
    <div>
      <p style={css.settingsRow}>
        These settings define how you connect to Malla via the API
        and also define the format of the text that’s returned by the API.
      </p>

      <div style={css.settingsRow}>
        <p style={css.labelStyle}>How would you like the text to be formatted?</p>

        <div style={styles.formatOptions}>
          <label style={styles.formatOptionLabel}>
            <input
              type="radio"
              style={css.radioButton}
              name="outputOption"
              checked={apiTextFormat === API_TEXT_FORMATS.HTML}
              onChange={() => updateProject({apiTextFormat: API_TEXT_FORMATS.HTML})}
            />

            HTML (ready for use in a website)
          </label>

          <label style={styles.formatOptionLabel}>
            <input
              type="radio"
              style={css.radioButton}
              name="outputOption"
              checked={apiTextFormat === API_TEXT_FORMATS.RAW}
              onChange={() => updateProject({apiTextFormat: API_TEXT_FORMATS.RAW})}
            />

            Plain text (if you have used markdown for formatting you will need to parse this yourself)
          </label>
        </div>
      </div>

      <div style={css.settingsRow}>
        <p style={css.labelStyle}>Restrict access</p>

        <label>
          <input
            type="checkbox"
            style={css.radioButton}
            checked={requireApiKey}
            onChange={() => updateProject({requireApiKey: !requireApiKey})}
          />

          Require a key to read from the API (the key must be passed with each request as a parameter in the URL).
        </label>

        <p style={styles.apiKeyText}>{apiKeyText}</p>

        {apiKeyNote}
      </div>

      <div style={css.settingsRow}>
        <label style={css.labelStyle}>Your API endpoint</label>

        <p>{apiLink}</p>
      </div>

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
