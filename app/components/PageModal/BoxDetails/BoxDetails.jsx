import React from 'react';
const {Component, PropTypes} = React;

import MarkedDownText from '../../MarkedDownText/MarkedDownText.jsx';
import Icon from '../../Icon/Icon.jsx';
import PageModalWrapper from '../PageModalWrapper.jsx';

import {
  ANIMATION_DURATION,
  BOX_TYPES,
  COLORS,
  DIMENSIONS,
  FONT_FAMILIES,
  ICONS,
  TEXT_PADDING,
} from '../../../constants.js';

import {
  css,
  makeArray,
  markdownToHtml,
} from '../../../utils';

class BoxDetails extends Component {
  constructor(props) {
    super(props);

    this.updateBox = this.updateBox.bind(this);
    this.deleteBox = this.deleteBox.bind(this);
    this.onIdChange = this.onIdChange.bind(this);
    this.onTextBoxChange = this.onTextBoxChange.bind(this);
    this.renderDeveloperOptions = this.renderDeveloperOptions.bind(this);
    this.renderFormatWrapper = this.renderFormatWrapper.bind(this);
    this.lockId = this.lockId.bind(this);

    const currentScreen = this.props.screens[this.props.currentScreenKey];
    this.currentProjectKey = currentScreen.projectKey;

    let textTooLong = false;

    const box = this.props.boxes[this.props.activeBox.id];

    if (box) {
      textTooLong = box.limitLength && box.text.length > box.lengthLimit;
    } else {
      console.warn('There is no active box:', this.props);
    }

    this.state = {
      idIsAvailable: true,
      idIsNotEmpty: true,
      idIsValidFormat: true,
      isValidOverall: true,
      showFormatted: false,
      textTooLong: textTooLong,
      text: box.text,
      id: box.label,
      limitLength: box.limitLength || false,
      lengthLimit: box.lengthLimit || 0,
      plainTextOnly: box.plainTextOnly || false,
      lockId: box.lockId || false,
    };
  }

  onIdChange(e) {
    const currentId = e.target.value;
    let idIsAvailable;
    let idIsNotEmpty = true;
    let idIsValidFormat = true;

    if (!currentId) {
      idIsNotEmpty = false;
    } else if (!/^[A-Za-z][A-Za-z0-9-_]*$/.test(currentId)) {
      idIsValidFormat = false;
    }

    const boxesWithSameId = makeArray(this.props.boxes)
      .filter(box => {
        const boxIsInCurrentProject = box.projectKey === this.currentProjectKey;
        const boxHasSameLabelAsInput = box.label === currentId;
        const boxIsNotTheBoxBeingEdited = box._key !== this.props.activeBox.id;

        return (boxIsInCurrentProject && boxHasSameLabelAsInput && boxIsNotTheBoxBeingEdited);
      });

    idIsAvailable = !boxesWithSameId.length;

    if (this.state.idIsAvailable !== idIsAvailable) {
      this.setState({idIsAvailable});
    }

    if (this.state.idIsNotEmpty !== idIsNotEmpty) {
      this.setState({idIsNotEmpty});
    }

    if (this.state.idIsValidFormat !== idIsValidFormat) {
      this.setState({idIsValidFormat});
    }

    const isValidOverall = idIsAvailable && idIsNotEmpty && idIsValidFormat;

    if (this.state.isValidOverall !== isValidOverall) {
      this.setState({isValidOverall});
    }

    this.setState({id: currentId});
  }

  onTextBoxChange(e) {
    const {value} = e.target;

    this.setState({text: value});

    if (this.state.textTooLong) {
      if (value.length <= this.state.lengthLimit) {
        this.setState({textTooLong: false});
      }
    } else {
      if (this.state.limitLength && value.length > this.state.lengthLimit) {
        this.setState({textTooLong: true});
      }
    }
  }

  lockId() {
    const sure = window.confirm(`Once you lock this ID (${this.state.id}), it can never be changed`);

    if (sure) this.setState({lockId: true});
  }

  updateBox() {
    const idIsValid = this.state.idIsNotEmpty && this.state.idIsAvailable;
    const box = this.props.boxes[this.props.activeBox.id];
    const isLabel = box.type === BOX_TYPES.LABEL;

    if (isLabel || idIsValid) {
      const newProps = {
        text: this.state.text,
        limitLength: this.state.limitLength,
        lengthLimit: this.state.lengthLimit,
        plainTextOnly: this.state.plainTextOnly,
        lockId: this.state.lockId,
        html: markdownToHtml(this.state.text),
      };

      if (!isLabel) {
        newProps.label = this.state.id;
      }

      this.props.updateBox(this.props.activeBox.id, newProps);
    }

    this.props.setActiveBox(null);
    this.props.hideModal();
  }

  deleteBox() {
    const box = this.props.boxes[this.props.activeBox.id];
    let sure = true;

    if (box.type !== BOX_TYPES.LABEL && box.text) {
      sure = window.confirm('If you delete this and it is being used, things will break. Cool?');
    }

    if (sure) {
      this.props.setActiveBox(null);
      this.props.removeBox(this.props.activeBox.id);
      this.props.hideModal();
    }
  }

  renderDeveloperOptions() {
    const box = this.props.boxes[this.props.activeBox.id];

    if (box.type === BOX_TYPES.LABEL) return null;

    let idError = '';

    if (!this.state.idIsAvailable) {
      idError = 'This id is already in use';
    } else if (!this.state.idIsNotEmpty) {
      idError = 'Try something a little more descriptive';
    } else if (!this.state.idIsValidFormat) {
      idError = 'The ID must only contain letters, numbers, dashes and underscores. It cannot start with a number.';
    }

    const FIRST_COL = 140;

    const disableLockButton = !!idError || this.state.lockId;

    const styles = {
      developerOptionsWrapper: {
        background: COLORS.OFF_WHITE,
        padding: '20px 20px 0px',
        margin: '30px -24px 0',
        boxShadow: 'inset 0 0 3px 0px rgba(0, 0, 0, 0.2)',
        overflowY: 'auto', // lazy, easier than proper responsive
      },
      title: {
        fontSize: 17,
        textAlign: 'center',
        paddingBottom: 10,
        fontWeight: 400,
      },
      optionRow: {
        minHeight: 50,
        display: 'flex',
        flexFlow: 'row',
        alignItems: 'center',
      },
      optionName: {
        flex: `0 0 ${FIRST_COL}px`,
      },
      numberInput: {
        width: 60,
        borderWidth: 0,
        borderBottom: `1px dashed ${COLORS.GRAY}`,
        padding: 2,
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginRight: 7,
      },
      lengthLimitInput: {
        opacity: this.state.limitLength ? 1 : 0,
        transition: `opacity ${ANIMATION_DURATION}ms`,
      },
      lengthLimitDesc: {
        opacity: this.state.limitLength ? 1 : 0,
        transition: `opacity ${ANIMATION_DURATION}ms`,
      },
      checkbox: {
        transform: 'scale(1.3333)',
        marginRight: 20,
      },
      idInput: {
        ...css.inputStyle,
        ...css.shadow('inset'),
        flex: '1 0 auto',
        backgroundColor: this.state.lockId ? COLORS.GRAY_LIGHT : null,
        fontFamily: FONT_FAMILIES.MONOSPACE,
        fontSize: 16,
      },
      idLockButton: {
        flex: '0 0 90px',
        backgroundColor: disableLockButton ? COLORS.GRAY : COLORS.PRIMARY,
        cursor: disableLockButton ? 'default' : 'pointer',
        color: COLORS.WHITE,
        padding: 10,
        marginLeft: 10,
      },
      idError: {
        fontSize: 13,
        fontWeight: 400,
        minHeight: 26, // so that it takes the same height when empty
        color: COLORS.ERROR,
        marginTop: 2,
      },
    };

    const toggleLimitLength = () => {
      const newProps = {
        limitLength: !this.state.limitLength
      };

      // if turning the limit on and there's no value yet,
      // set a default to the current text length limit
      if (newProps.limitLength) {
        if (!this.state.lengthLimit) {
          newProps.lengthLimit = this.state.text.length || 20;
        } else {
          newProps.textTooLong = this.state.text.length > this.state.lengthLimit;
        }
      } else { // if turning it off
        newProps.textTooLong = false;
      }

      this.setState(newProps);
    };

    const handleLengthLimitChange = e => {
      const {value} = e.target;
      const lengthLimit = isFinite(value) ? Number(value) : 0;

      const newProps = {lengthLimit};

      // make sure the 'limitLength' is set appropriately
      newProps.limitLength = !!lengthLimit;

      // mark the text as too long or not
      newProps.textTooLong = lengthLimit && this.state.text.length > lengthLimit;

      this.setState(newProps);
    };

    const togglePlainTextOnly = () => {
      this.setState({plainTextOnly: !this.state.plainTextOnly})
    };

    return (
      <div style={styles.developerOptionsWrapper}>
        <p style={styles.title}>Developer options</p>

        <div style={styles.optionRow}>
          <label htmlFor="limit-text-length-input" style={styles.optionName}>Limit text length</label>

          <input
            id="limit-text-length-input"
            style={styles.checkbox}
            type="checkbox"
            checked={this.state.limitLength}
            onChange={toggleLimitLength}
          />

          <input
            style={{...styles.numberInput, ...styles.lengthLimitInput}}
            type="number"
            min="0"
            value={this.state.lengthLimit}
            onChange={handleLengthLimitChange}
          />

          <span style={styles.lengthLimitDesc}>characters</span>
        </div>

        <div style={styles.optionRow}>
          <label htmlFor="plain-text-only-input" style={styles.optionName}>Plain text only</label>

          <input
            id="plain-text-only-input"
            style={styles.checkbox}
            type="checkbox"
            checked={this.state.plainTextOnly}
            onChange={togglePlainTextOnly}
          />

          <span
            role="button"
            onClick={togglePlainTextOnly}
          >(No formatting will be applied)</span>
        </div>

        <div style={styles.optionRow}>
          <label htmlFor="text-box-id-input" style={styles.optionName}>Unique ID</label>

          <input
            id="text-box-id-input"
            defaultValue={box.label}
            disabled={this.state.lockId}
            title={this.state.lockId ? 'This ID has been locked and cannot be changed' : 'This is what identifies the text in the API'}
            style={styles.idInput}
            spellCheck={false}
            onChange={this.onIdChange}
          />

          <button
            style={styles.idLockButton}
            onClick={this.lockId}
            disabled={disableLockButton}
          >Lock ID</button>
        </div>

        <div style={styles.idError}>{idError}</div>
      </div>
    );
  }

  renderFormatWrapper() {
    const styles = {
      formatWrapper: {
        display: 'flex',
        direction: 'row',
        justifyContent: 'space-between',
        height: this.state.plainTextOnly ? 0 : 50,
        overflow: 'hidden',
        transition: `height ${ANIMATION_DURATION}ms`,
      },
      previewButton: {
        color: COLORS.WHITE,
        padding: 10,
        marginTop: 10,
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: DIMENSIONS.SPACE_L * 2,
      },
      previewButtonText: {
        marginLeft: 10,
      },
      formattingHelp: {
        marginTop: 10,
        textDecoration: 'underline',
      },
    };

    return (
      <div style={styles.formatWrapper}>
        <button
          style={{
            ...styles.previewButton,
            backgroundColor: this.state.showFormatted ? COLORS.ACCENT : COLORS.PRIMARY,
          }}
          onClick={() => {
            this.setState({
              showFormatted: !this.state.showFormatted,
              peekFormatted: false,
            });
          }}
          onMouseOver={() => {
            this.setState({peekFormatted: true});
          }}
          onMouseOut={() => {
            this.setState({peekFormatted: false});
          }}
        >
          <Icon
            icon={ICONS.EYE}
            size={22}
            color={COLORS.WHITE}
          />

          Preview
        </button>

        <a
          style={styles.formattingHelp}
          href="http://commonmark.org/help/"
          target="_blank"
        >
          Formatting help
        </a>
      </div>
    );
  }

  render() {
    if (!this.props.activeBox) {
      console.warn('The edit box modal is trying to show but there is no active box');
      return null;
    }
    
    const box = this.props.boxes[this.props.activeBox.id];

    if (!box) {
      console.warn(`No box with an id '${this.props.activeBox.id} could be found`);
      return null;
    }

    const showFormatted = (this.state.showFormatted || this.state.peekFormatted) && !this.state.plainTextOnly;

    const styles = {
      textWrapper: {
        position: 'relative',
        height: DIMENSIONS.SPACE_L * 6,
      },
      textInput: {
        display: 'block', // normalize textarea and div
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        opacity: showFormatted ? 0 : 1,
        resize: 'none',
        ...css.inputStyle,
        padding: TEXT_PADDING,
        ...css.shadow('inset'),
        borderColor: this.state.textTooLong ? COLORS.ERROR : COLORS.GRAY_LIGHT,
        outline: 0,
        transition: `opacity ${ANIMATION_DURATION}ms`,
      },
      formattedPreview: {
        backgroundColor: COLORS.WHITE,
        overflow: 'auto',
        opacity: showFormatted ? 1 : 0,
        pointerEvents: showFormatted ? 'all' : 'none',
      },
    };

    return (
      <PageModalWrapper
        {...this.props}
        title={'Edit text item'}
        width={DIMENSIONS.SPACE_L * 11}
        showOk={true}
        okText={'Save'}
        onOk={this.updateBox}
        okDisabled={!this.state.isValidOverall || this.state.textTooLong}
      >
        <div style={styles.textWrapper}>
          <textarea
            ref={el => this.textEl = el}
            value={this.state.text}
            onChange={this.onTextBoxChange}
            style={styles.textInput}
            autoFocus={true}
          />

          <MarkedDownText
            style={{
              ...styles.textInput,
              ...styles.formattedPreview,
            }}
            markdown={this.state.text}
          />
        </div>

        {this.renderFormatWrapper()}

        {this.renderDeveloperOptions()}
      </PageModalWrapper>
    );
  }
}

BoxDetails.propTypes = {
  // props
  activeBox: PropTypes.object,
  boxes: PropTypes.object,
  currentScreenKey: PropTypes.string.isRequired,
  screens: PropTypes.object.isRequired,

  // methods
  updateBox: PropTypes.func.isRequired,
  removeBox: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  setActiveBox: PropTypes.func.isRequired,
};

export default BoxDetails;
