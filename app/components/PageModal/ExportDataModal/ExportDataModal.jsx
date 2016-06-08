import React from 'react';
const {Component, PropTypes} = React;
import forOwn from 'lodash/forOwn';

import {
  API_TEXT_FORMATS,
  COLORS,
  DIMENSIONS,
  BOX_TYPES,
  FONT_FAMILIES,
} from '../../../constants.js';

import {
  css,
  getCurrentProjectAndScreen,
} from '../../../utils';

const styles = {
  codePreview: {
    marginTop: 20,
    lineHeight: 1.6,
    fontSize: 14,
    fontFamily: FONT_FAMILIES.MONOSPACE,
    color: COLORS.GRAY_DARK,
    ...css.inputStyle,
    overflow: 'auto',
  },
  apiUrlWrapper: {
    marginTop: 20,
  },
  apiUrl: {
    color: COLORS.ACCENT,
    fontWeight: 400,
  },
  note: {
    fontSize: 14,
  },
  formatOptions: {
    marginTop: 20,
  },
  formatOptionLabel: {
    display: 'block',
    marginTop: 5,
    cursor: 'pointer',
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

  componentDidMount() {
    this.props.setModalState({
      title: 'API access',
      showOk: true,
      onOk: this.onOk,
      width: DIMENSIONS.SPACE_L * 20,
    });
  }

  onOk() {
    const {currentScreenKey, screens, updateProject} = this.props;

    const currentProjectKey = screens[currentScreenKey].projectKey;
    
    updateProject(currentProjectKey, {
      apiTextFormat: this.state.apiTextFormat,
    });
  }

  render() {
    const {boxes, currentScreenKey, screens} = this.props;

    const currentProjectKey = screens[currentScreenKey].projectKey;
    const exportData = {};

    forOwn(boxes, (box, id) => {
      if (box && box.type !== BOX_TYPES.LABEL) {
        let value;

        if (this.state.apiTextFormat === API_TEXT_FORMATS.HTML && box.html) {
          value = box.html;
        } else {
          value = box.text;
        }

        // TODO (davidg): pretty sure it's impossible for a box to not have a label now.
        // Check this then remove "|| id"
        exportData[box.label || id] = value;
      }
    });

    const queryParams = this.state.apiTextFormat !== API_TEXT_FORMATS.HTML
      ? `?format=${this.state.apiTextFormat}`
      : ''; // html is the default

    const apiUrl = `${location.origin}/api/${currentProjectKey}.json${queryParams}`;

    const apiLink = (
      <a
        style={styles.apiUrl}
        href={apiUrl}
        target="_blank"
      >{apiUrl}</a>
     );

    return (
      <div>
          <h2>How would you like the text to be formatted?</h2>

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

        <p style={styles.apiUrlWrapper}>To access this data via API, go to {apiLink}</p>

        <pre style={styles.codePreview}>
          {JSON.stringify(exportData, null, 2)}
        </pre>

        <p style={styles.note}>The API will return text for all screens in the current project.</p>
      </div>
    );
  }
}

ExportDataModal.propTypes = {
  // state
  screens: PropTypes.object.isRequired,
  boxes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  currentScreenKey: PropTypes.string.isRequired,

  // actions
  setModalState: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
};

export default ExportDataModal;
