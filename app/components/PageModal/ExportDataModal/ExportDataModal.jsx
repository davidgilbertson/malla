import React from 'react';
const {Component, PropTypes} = React;

import PageModalWrapper from '../PageModalWrapper.jsx';

import {
  API_TEXT_FORMATS,
  COLORS,
  DIMENSIONS,
  FONT_FAMILIES,
} from '../../../constants.js';

import {
  getBoxJson,
  getCurrentProjectAndScreen,
} from '../../../utils';

const styles = {
  projectNote: {
    marginBottom: 22,
    textAlign: 'center',
  },
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
  previewLabel: {
    marginTop: 40,
    textAlign: 'center',
  },
  codePreview: {
    margin: '4px 0 0',
    padding: 10,
    lineHeight: 1.6,
    fontSize: 14,
    fontFamily: FONT_FAMILIES.MONOSPACE,
    backgroundColor: COLORS.OFF_WHITE,
    color: COLORS.GRAY,
    border: `1px solid ${COLORS.GRAY_LIGHT}`,
    overflow: 'auto',
  },
};

class ExportDataModal extends Component {
  constructor(props) {
    super(props);

    this.onOk = this.onOk.bind(this);

    const {currentProject} = getCurrentProjectAndScreen(this.props);
    const apiTextFormat = (currentProject.val && currentProject.val.apiTextFormat) || API_TEXT_FORMATS.HTML;

    this.state = {
      apiTextFormat,
    };
  }

  onOk() {
    const {currentScreenKey, screens, updateProject} = this.props;

    const currentProjectKey = screens[currentScreenKey].projectKey;

    updateProject(currentProjectKey, {
      apiTextFormat: this.state.apiTextFormat,
    });
  }

  render() {
    const {boxes} = this.props;
    const {currentProject} = getCurrentProjectAndScreen();

    const exportData = getBoxJson({
      boxes,
      format: this.state.apiTextFormat,
      projectKey: currentProject.key,
    });

    const queryParams = this.state.apiTextFormat !== API_TEXT_FORMATS.HTML
      ? `?format=${this.state.apiTextFormat}`
      : ''; // html is the default

    const apiUrl = `${location.origin}/api/${currentProject.key}.json${queryParams}`;

    const apiLink = (
      <a
        style={styles.apiUrl}
        href={apiUrl}
        target="_blank"
      >{apiUrl}</a>
     );

    return (
      <PageModalWrapper
        {...this.props}
        title="API access"
        showOk
        onOk={this.onOk}
        width={DIMENSIONS.SPACE_L * 20}
      >
        <p style={styles.projectNote}>This API endpoint will return text for all screens in the <strong>{currentProject.val.name}</strong> project.</p>

        <hr />

        <p>How would you like the text to be formatted?</p>

        <div style={styles.formatOptions}>
          <label style={styles.formatOptionLabel}>
            <input
              type="radio"
              name="outputOption"
              checked={this.state.apiTextFormat === API_TEXT_FORMATS.HTML}
              onChange={() => this.setState({apiTextFormat: API_TEXT_FORMATS.HTML})}
            />
            HTML (ready for use in a website)
          </label>

          <label style={styles.formatOptionLabel}>
            <input
              type="radio"
              name="outputOption"
              checked={this.state.apiTextFormat === API_TEXT_FORMATS.RAW}
              onChange={() => this.setState({apiTextFormat: API_TEXT_FORMATS.RAW})}
            />
            Plain text (if you have used markdown for formatting you will need to parse this yourself)
          </label>
        </div>

        <p style={styles.apiUrlWrapper}>Your API endpoint is: {apiLink}</p>

        <p style={styles.previewLabel}>Preview</p>

        <pre style={styles.codePreview}>
          {JSON.stringify(exportData, null, 2)}
        </pre>
      </PageModalWrapper>
    );
  }
}

ExportDataModal.propTypes = {
  // props
  screens: PropTypes.object.isRequired,
  boxes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  currentScreenKey: PropTypes.string.isRequired,

  // methods
  updateProject: PropTypes.func.isRequired,
};

export default ExportDataModal;
