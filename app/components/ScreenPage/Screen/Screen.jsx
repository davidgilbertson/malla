import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';
import isEqual from 'lodash/isEqual';

import BoxListContainer from '../../BoxListContainer/BoxListContainer.jsx';
import Button from '../../Button/Button.jsx';
import HelpPanel from '../../HelpPanel/HelpPanel.jsx';
import ScreenHeader from '../ScreenHeader/ScreenHeader.jsx';

import {
  css,
  getEventDims,
} from '../../../utils';

import {
  BOX_TYPES,
  BREAKPOINTS,
  COLORS,
  DIMENSIONS,
  GRID_SIZE,
  DROP_MODALS,
  MODALS,
  SIGN_IN_STATUSES,
} from '../../../constants.js';

const styles = {
  workspace: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    left: 0,
    right: 0,
    top: DIMENSIONS.SPACE_L,
    bottom: DIMENSIONS.SPACE_M,
    background: COLORS.WHITE,
    [BREAKPOINTS.TABLET_LANDSCAPE]: {
      left: DIMENSIONS.SPACE_M,
      right: DIMENSIONS.SPACE_M,
      ...css.shadow('large'),
    },
  },
  canvas: {
    flex: '0 1 100%',
    position: 'relative', // to contain absolute descendants
    overflow: 'auto',
    backgroundImage: 'url(/images/grid-dot-gray_20x20.gif)',
    backgroundSize: '10px 10px',
    backgroundAttachment: 'local',
    cursor: 'crosshair',
    boxShadow: `inset 1px 1px ${COLORS.WHITE}, inset -2px -2px ${COLORS.WHITE}`, // covers dots near the edge
  },
  betaFooter: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    padding: '7px 10px',
    fontWeight: 400,
    fontSize: 12,
    color: COLORS.GRAY_DARK,
    textAlign: 'center',
  },
  signInWords: {
    textAlign: 'center',
    margin: `${DIMENSIONS.SPACE_L * 2}px 20px 0`,
  },
};

class Screen extends Component {
  constructor(props) {
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.sendBox = this.sendBox.bind(this);

    this.isMoving = false;
    this.startX = 0;
    this.startY = 0;
    this.placeholderStyle = {
      display: 'none',
      border: '1px solid grey',
      position: 'absolute',
      boxShadow: '0 0 0 1px white', // cover the dots 1px off the edge
    };
    this.shortTimer = null;
    this.longTimer = null;

    this.state = {
      waitedABit: false, // waiting for the store to load
      waitedALot: false, // waiting for the store to load some more
    };
  }

  componentDidMount() {
    // give the store time to set the user status before rendering the login prompt
    this.shortTimer = setTimeout(() => {
      this.setState({waitedABit: true});
    }, 500);

    this.longTimer = setTimeout(() => {
      this.setState({waitedALot: true});
    }, 5000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) return true;

    return (
      !isEqual(nextProps.user, this.props.user) ||
      !isEqual(nextProps.currentTool, this.props.currentTool) ||
      !isEqual(nextProps.currentScreenKey, this.props.currentScreenKey) ||
      !isEqual(nextProps.screens, this.props.screens) ||
      !isEqual(nextProps.projects, this.props.projects)
    );
  }

  componentWillUnmount() {
    clearTimeout(this.shortTimer);
    clearTimeout(this.longTimer);
  }

  onDragStart(e) {
    if (e.target !== e.currentTarget) return; // only work with clicks originating on the canvas

    this.props.boxActions.setActiveBox(null); // deselect all boxes
    document.activeElement && document.activeElement.blur(); // blurs the textarea (else Edge shows the cursor still)
    this.isMoving = true;
    e.preventDefault();

    const relativeDims = getEventDims(e, {snap: true, relative: true});
    const pageDims = getEventDims(e, {snap: true, relative: false});
    this.startX = relativeDims.x;
    this.startY = relativeDims.y;
    this.offsetX = pageDims.x - this.startX;
    this.offsetY = pageDims.y - this.startY;

    this.placeholderEl.style.left = `${this.startX}px`;
    this.placeholderEl.style.top = `${this.startY}px`;
    this.placeholderEl.style.width = '0px';
    this.placeholderEl.style.height = '0px';
    this.placeholderEl.style.display = 'block';

    window.addEventListener('mousemove', this.onDragMove, false);
    window.addEventListener('mouseup', this.onDragEnd, false);
    window.addEventListener('touchmove', this.onDragMove, false);
    window.addEventListener('touchend', this.onDragEnd, false);
  }

  onDragMove(e) {
    if (!this.isMoving) return;

    const mouseDims = getEventDims(e, {snap: true, relative: false});

    this.placeholderEl.style.width = `${(mouseDims.x - this.offsetX) - this.startX}px`;
    this.placeholderEl.style.height = `${(mouseDims.y - this.offsetY) - this.startY}px`;
  }

  onDragEnd() {
    this.isMoving = false;

    const boxDims = {
      left: parseInt(this.placeholderEl.style.left, 10),
      top: parseInt(this.placeholderEl.style.top, 10),
      width: parseInt(this.placeholderEl.style.width, 10),
      height: parseInt(this.placeholderEl.style.height, 10),
    };

    const wideEnough = boxDims.width > GRID_SIZE * 2;
    const highEnough = boxDims.height > GRID_SIZE * 2;

    if (wideEnough && highEnough) {
      this.sendBox(boxDims);
    }

    this.placeholderEl.style.display = 'none';

    window.removeEventListener('mousemove', this.onDragMove, false);
    window.removeEventListener('mouseup', this.onDragEnd, false);
    window.removeEventListener('touchmove', this.onDragMove, false);
    window.removeEventListener('touchend', this.onDragEnd, false);
  }

  sendBox(dims) {
    const type = this.props.currentTool === DROP_MODALS.LABEL
      ? BOX_TYPES.LABEL
      : BOX_TYPES.TEXT;

    this.props.boxActions.add({
      ...dims,
      type,
    });
  }

  render() {
    const {user} = this.props;

    if (typeof window === 'undefined') {
      // I only ever want this blank coming back from the server
      // else the 'loading' HTML comes up for a flash
      return <div style={styles.workspace}></div>;
    }

    // it's been a while and the user isn't signed in yet
    if (!user || user.signInStatus !== SIGN_IN_STATUSES.SIGNED_IN && this.state.waitedALot) {
      return (
        <div style={styles.workspace}>
          <h1 style={styles.signInWords}>Something's not right. Try signing in.</h1>

          <Button
            style={css.buttonStyle}
            onClick={() => {
              this.props.showModal(MODALS.SOCIAL_SIGN_IN);
            }}
          >
            {MALLA_TEXT.signIn}
          </Button>
        </div>
      );
    }

    // the page is loaded but we're waiting for the user sign in with firebase to happen
    if (!user || user.signInStatus !== SIGN_IN_STATUSES.SIGNED_IN && this.state.waitedABit) {
      return (
        <div style={styles.workspace}>
          <h1 style={styles.signInWords}>Loading...</h1>
        </div>
      );
    }

    const thereAreNoScreens = !Object.keys(this.props.screens).length;
    const currentScreen = this.props.screens[this.props.currentScreenKey];
    const noCurrentScreen = !currentScreen || currentScreen.deleted;

    // data should have loaded by now, but there's nothing. Probably a bad URL
    if ((thereAreNoScreens || noCurrentScreen) && this.state.waitedALot) {
      this.props.navigateToProject(); // navigate to the first project/screen
    }

    // data isn't loaded, waiting...
    if ((thereAreNoScreens || noCurrentScreen) && this.state.waitedABit) {
      return (
        <div style={styles.workspace}>
          <h1 style={styles.signInWords}>Loading...</h1>
        </div>
      );
    }

    return (
      <div style={styles.workspace}>
        <ScreenHeader {...this.props} />

        <div
          style={styles.canvas}
          onMouseDown={this.onDragStart}
          onTouchStart={this.onDragStart}
        >
          <BoxListContainer />

          <div
            ref={el => this.placeholderEl = el}
            style={this.placeholderStyle}
          ></div>

          <HelpPanel />
        </div>

        <footer
          style={styles.betaFooter}
        >
          {MALLA_TEXT.footerDisclaimer}
        </footer>
      </div>
    );
  }
}

Screen.propTypes = {
  // state
  user: PropTypes.object.isRequired,
  currentTool: PropTypes.string.isRequired,
  currentScreenKey: PropTypes.string.isRequired,
  screens: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,

  // actions
  boxActions: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired,
  showDropModal: PropTypes.func.isRequired,
  navigateToScreen: PropTypes.func.isRequired,
  navigateToProject: PropTypes.func.isRequired,
};

export default Radium(Screen);
