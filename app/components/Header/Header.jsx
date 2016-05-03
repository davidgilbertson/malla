import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import {
  COLORS,
  DIMENSIONS,
  MODALS,
} from '../../constants.js';

const HEIGHT = DIMENSIONS.LAYOUT.HEADER_HEIGHT;
const GUTTER = 6;

const styles = {
  header: {
    flex: `0 0 ${HEIGHT}px`,
    backgroundColor: COLORS.PRIMARY_DARK,
    textAlign: 'center',
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: COLORS.WHITE,
    padding: `0 ${GUTTER}px`,
  },
  title: {
    fontSize: 24,
  },
  headerButton: {
    height: HEIGHT - (GUTTER * 2),
    color: COLORS.WHITE,
    background: COLORS.PRIMARY,
    padding: '0 8px',
  },
};

const Header = ({showModal}) => (
  <header style={styles.header}>
    <h1 style={styles.title}>Malla</h1>
    <div>
      <button
        style={styles.headerButton}
        onClick={() => {
          showModal(MODALS.EXPORT_DATA)
        }}
      >Get words as JSON</button>
    </div>
  </header>
);

Header.propTypes = {
  showModal: PropTypes.func.isRequired,
};

export default Radium(Header);
