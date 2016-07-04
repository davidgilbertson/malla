import React from 'react';
const {PropTypes} = React;

import PageModalWrapper from '../PageModalWrapper.jsx';
import ApiAccessSettings from '../../ApiAccessSettings/ApiAccessSettings.jsx';

import {
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

const ExportDataModal = props => {
  const project = getCurrentProjectAndScreen().currentProject;

  const exportData = getBoxJson({
    boxes: props.boxes,
    format: project.val.apiTextFormat,
    projectKey: project.key,
  });

  return (
    <PageModalWrapper
      {...props}
      title="API access"
      showOk
      width={DIMENSIONS.SPACE_L * 20}
    >
      <p style={styles.projectNote}>This API endpoint will return text for all screens in the <strong>{project.val.name}</strong> project.</p>

      <hr />

      <ApiAccessSettings
        {...props}
        project={project}
      />

      <p style={styles.previewLabel}>Preview</p>

      <pre style={styles.codePreview}>
        {JSON.stringify(exportData, null, 2)}
      </pre>
    </PageModalWrapper>
  );
};

ExportDataModal.propTypes = {
  // props
  boxes: PropTypes.object.isRequired,

  // methods
  updateProject: PropTypes.func.isRequired,
};

export default ExportDataModal;
