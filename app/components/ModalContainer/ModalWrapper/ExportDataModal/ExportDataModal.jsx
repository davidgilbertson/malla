import React from 'react';

import Modal from '../Modal/Modal.jsx';

const ExportDataModal = (props) => {
  return (
    <Modal
      {...props}
      title="Export data"
      width={800}
    >
      <div>The body of the export data modal</div>
    </Modal>
  );
};

export default ExportDataModal;
