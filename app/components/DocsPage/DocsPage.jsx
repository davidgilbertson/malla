import React from 'react';
import Radium from 'radium';

import HtmlSnippet from '../HtmlSnippet/HtmlSnippet.jsx';

import {
  css,
} from '../../utils';

import {
  BREAKPOINTS,
  COLORS,
  DIMENSIONS,
} from '../../constants.js';

const styles = {
  panel: {
    position: 'absolute',
    top: DIMENSIONS.SPACE_L,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.WHITE,
    border: `1px solid ${COLORS.WHITE}`,
    overflowY: 'auto',
    [BREAKPOINTS.TABLET_LANDSCAPE]: {
      left: DIMENSIONS.SPACE_M,
      right: DIMENSIONS.SPACE_M,
      ...css.shadow('large'),
    },
  },
  container: {
    margin: '0 auto',
    // the maxWidths here and below try and get the images to be 480 or 640 for crisper images
    maxWidth: 640 + (DIMENSIONS.SPACE_S * 2),
    paddingBottom: '33vh',
    [BREAKPOINTS.TABLET_LANDSCAPE]: {
      maxWidth: (480 * 2) + (DIMENSIONS.SPACE_S * 4),
    },
    [BREAKPOINTS.DESKTOP]: {
      maxWidth: (640 * 2) + (DIMENSIONS.SPACE_S * 4),
    },
  },
  title: {
    marginTop: DIMENSIONS.SPACE_M,
    textAlign: 'center',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: DIMENSIONS.SPACE_L,
    [BREAKPOINTS.TABLET_LANDSCAPE]: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
  },
  firstStep: {
    [BREAKPOINTS.TABLET_LANDSCAPE]: {
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
  },
  words: {
    padding: DIMENSIONS.SPACE_S,
    flex: '1 1 auto',
    [BREAKPOINTS.TABLET_LANDSCAPE]: {
      width: '50%',
    },
  },
  picture: {
    padding: DIMENSIONS.SPACE_S,
    flex: '1 1 auto',
    [BREAKPOINTS.TABLET_LANDSCAPE]: {
      width: '50%',
    },
  },
  img: {
    maxWidth: '100%',
    ...css.shadow('small'),
  },
};

const DocsPage = () => {
  const stepData = [
    {
      words: MALLA_TEXT.gettingStarted30,
      alt: 'Completed grand tourist site',
      img: 'grand-tourist-complete_1024x768.png',
    },
    {
      words: MALLA_TEXT.gettingStarted35,
      alt: 'Completed grand tourist site',
      img: 'workspace_1280x800.png',
    },
    {
      words: MALLA_TEXT.gettingStarted40,
      alt: 'Malla workspace',
      img: 'gs-first-text-item.png',
    },
    {
      words: MALLA_TEXT.gettingStarted50,
      alt: 'Malla workspace',
      img: 'gs-box-edit_1280x800.png',
    },
    {
      words: MALLA_TEXT.gettingStarted55,
      alt: 'Malla workspace',
      img: 'gs-many-text-items.png',
    },
    {
      words: MALLA_TEXT.gettingStarted60,
      alt: 'Malla workspace',
      img: 'gs-box-details-raw_1280x800.png',
    },
    {
      words: MALLA_TEXT.gettingStarted70,
      alt: 'Malla workspace',
      img: 'gs-box-details-preview_1280x800.png',
    },
    {
      words: MALLA_TEXT.gettingStarted75,
      alt: 'Malla workspace',
      img: 'gs-text-limit_1280x800.png',
    },
    {
      words: MALLA_TEXT.gettingStarted80,
      alt: 'Malla workspace',
      img: 'gs-screens_1280x800.png',
    },
    {
      words: MALLA_TEXT.gettingStarted90,
      alt: 'Malla workspace',
      img: 'gs-api-details_1280x800.png',
    },
  ];

  const stepDom = stepData.map((step, i) => (
    <div key={i} style={styles.step}>
      <div style={styles.words}>
        <HtmlSnippet html={step.words} />
      </div>

      <div style={styles.picture}>
        {!!step.img && (
          <a
            href={`/images/${step.img}`}
            target="_blank"
          >
            <img
              src={`/images/${step.img}`}
              alt={step.alt}
              style={styles.img}
            />
          </a>
        )}
        {!!step.words2 && (
          <HtmlSnippet
            html={step.words2}
          />
        )}
      </div>
    </div>
  ));

  return (
    <div
      style={styles.panel}
      className="malla-docs"
    >
      <div style={styles.container}>
        <div style={styles.title}>
          <HtmlSnippet
            html={MALLA_TEXT.gettingStartedTitle}
          />
        </div>

        <div style={{...styles.step, ...styles.firstStep}}>
          <div style={styles.words}>
            <HtmlSnippet html={MALLA_TEXT.gettingStarted10} />
          </div>

          <div style={styles.picture}>
            <HtmlSnippet html={MALLA_TEXT.gettingStarted20} />
          </div>
        </div>

        {stepDom}
      </div>
    </div>
  );
};

export default Radium(DocsPage);
