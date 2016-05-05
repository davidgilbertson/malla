import React from 'react';
const {Component, PropTypes} = React;
import forOwn from 'lodash/forOwn';

import Modal from '../Modal/Modal.jsx';
import {COLORS} from '../../../../constants.js';

const styles = {
  textArea: {
    width: '100%',
    lineHeight: 1.6,
    fontSize: 14,
    fontFamily: 'Courier New, courier, monospace',
    color: COLORS.GRAY_DARK,
  },
};

class ExportDataModal extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.textAreaEl.style.height = `${this.textAreaEl.scrollHeight + 10}px`;
  }

  render() {
    const exportData = {};
    forOwn(this.props.boxes, (box, id) => {
      // TODO (davidg): nest
      exportData[box.label || id] = box.text;
    });

    return (
      <Modal
        {...this.props}
        title="Preview of the API response"
        showOK={true}
        width={1200}
      >
        <p>To access this data, go to {location.origin}.json</p>

        <textarea
          ref={el => this.textAreaEl = el}
          value={JSON.stringify(exportData, null, 2)}
          readOnly={true}
          style={styles.textArea}
          rows={exportData.length * 4}
        />
      </Modal>
    );
  }
}

ExportDataModal.propTypes = {
  boxes: PropTypes.object.isRequired,
};

export default ExportDataModal;
