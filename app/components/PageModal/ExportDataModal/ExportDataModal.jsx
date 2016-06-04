import React from 'react';
const {Component, PropTypes} = React;
import forOwn from 'lodash/forOwn';

import {
  COLORS,
  DIMENSIONS,
  BOX_TYPES,
  FONT_FAMILIES,
} from '../../../constants.js';

const styles = {
  textArea: {
    width: '100%',
    marginTop: 20,
    lineHeight: 1.6,
    fontSize: 14,
    fontFamily: FONT_FAMILIES.MONOSPACE,
    color: COLORS.GRAY_DARK,
    whiteSpace: 'pre',
  },
  apiUrl: {
    color: COLORS.ACCENT,
    fontWeight: 400,
  },
  proTip: {
    marginTop: 20,
  },
};

class ExportDataModal extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.textAreaEl.style.height = `${this.textAreaEl.scrollHeight + 10}px`;

    this.props.setModalState({
      title: 'API access',
      showOk: true,
      width: DIMENSIONS.SPACE_L * 20,
    });
  }

  render() {
    const exportData = {};
    let hasLineBreaks = false;

    forOwn(this.props.boxes, (box, id) => {
      if (box && box.type !== BOX_TYPES.LABEL) {
        exportData[box.label || id] = box.text;

        if (box.text.includes('\n')) {
          hasLineBreaks = true;
        }
      }
    });

    const lineBreakHint = hasLineBreaks
      ? (
        <p style={styles.proTip}>
          <strong>Pro tip:</strong> to maintain the line breaks in your text, use <code>white-space: pre-wrap</code> in your CSS.
        </p>
      ) : null;

    const {currentProjectKey} = this.props.user;

    const apiUrl = `${location.origin}/api/${currentProjectKey}.json`;

    const apiLink = (
      <a
        style={styles.apiUrl}
        href={apiUrl}
        target="_blank"
      >{apiUrl}</a>
     );

    return (
      <div>
        <p>To access this data via API, go to {apiLink}</p>

        <p>Note that this will fetch the text for all screens in the current project.</p>

        <textarea
          ref={el => this.textAreaEl = el}
          value={JSON.stringify(exportData, null, 2)}
          readOnly={true}
          style={styles.textArea}
          rows={exportData.length * 4}
        />

        {lineBreakHint}
      </div>
    );
  }
}

ExportDataModal.propTypes = {
  boxes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setModalState: PropTypes.func.isRequired,
};

export default ExportDataModal;
