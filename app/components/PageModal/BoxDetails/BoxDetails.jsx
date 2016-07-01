import React from 'react';
const {Component, PropTypes} = React;

import MarkedDownText from '../../MarkedDownText/MarkedDownText.jsx';
import Icon from '../../Icon/Icon.jsx';
import PageModalWrapper from '../PageModalWrapper.jsx';
import TextArea from '../../TextArea/TextArea.jsx';
import Input from '../../Input/Input.jsx';

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

    this.updateBoxAndClose = this.updateBoxAndClose.bind(this);
    this.deleteBox = this.deleteBox.bind(this);
    this.onIdChange = this.onIdChange.bind(this);
    this.onTextBoxChange = this.onTextBoxChange.bind(this);
    this.renderDeveloperOptions = this.renderDeveloperOptions.bind(this);
    this.renderFormatWrapper = this.renderFormatWrapper.bind(this);
    this.lockId = this.lockId.bind(this);
    this.isValid = this.isValid.bind(this);
    this.checkLength = this.checkLength.bind(this);

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
      showFormatted: false,
      textTooLong,
      text: box.text,
      id: box.label,
      limitLength: box.limitLength || false,
      lengthLimit: box.lengthLimit || 0,
      plainTextOnly: box.plainTextOnly || false,
      lockId: box.lockId || false,
    };
  }

  onIdChange(currentId) {
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
        const boxIsNotDeleted = !box.deleted;

        return (boxIsInCurrentProject && boxHasSameLabelAsInput && boxIsNotTheBoxBeingEdited && boxIsNotDeleted);
      });

    const idIsAvailable = !boxesWithSameId.length;

    if (this.state.idIsAvailable !== idIsAvailable) {
      this.setState({idIsAvailable});
    }

    if (this.state.idIsNotEmpty !== idIsNotEmpty) {
      this.setState({idIsNotEmpty});
    }

    if (this.state.idIsValidFormat !== idIsValidFormat) {
      this.setState({idIsValidFormat});
    }

    this.setState({id: currentId});
  }

  onTextBoxChange(text) {
    this.setState({text}, this.checkLength);
  }

  checkLength() {
    // called when either the text or the length limit change
    let textTooLong = false;
    let tooLongMessage = '';

    const lengthDelta = this.state.text.length - this.state.lengthLimit;

    if (this.state.limitLength && lengthDelta > 0) {
      textTooLong = true;
      tooLongMessage = `Too long by ${lengthDelta} character${lengthDelta === 1 ? '' : 's'}`;
    }

    this.setState({textTooLong, tooLongMessage});
  }

  lockId() {
    const sure = window.confirm(`Once you lock this ID (${this.state.id}), it can never be changed`);

    if (sure) this.setState({lockId: true});
  }

  isValid() {
    const box = this.props.boxes[this.props.activeBox.id];

    if (box.type === BOX_TYPES.LABEL) {
      return true;
    }

    return (
      !this.state.textTooLong
      && this.state.idIsNotEmpty
      && this.state.idIsAvailable
      && this.state.idIsValidFormat
    );
  }

  updateBoxAndClose() {
    if (!this.isValid()) return;

    const box = this.props.boxes[this.props.activeBox.id];

    const newProps = {
      text: this.state.text,
      limitLength: this.state.limitLength,
      lengthLimit: this.state.lengthLimit,
      plainTextOnly: this.state.plainTextOnly,
      lockId: this.state.lockId,
      html: markdownToHtml(this.state.text),
    };

    if (box.type !== BOX_TYPES.LABEL) {
      newProps.label = this.state.id;
    }

    this.props.updateBox(this.props.activeBox.id, newProps);
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
        padding: `${DIMENSIONS.SPACE_S}px ${DIMENSIONS.SPACE_S}px 0`,
        margin: `${DIMENSIONS.SPACE_S}px -${DIMENSIONS.SPACE_S}px 0`,
        boxShadow: 'inset 0 0 3px 0px rgba(0, 0, 0, 0.2)',
        overflowY: 'auto', // lazy, easier than proper responsive
      },
      title: {
        fontSize: 17,
        textAlign: 'center',
        paddingBottom: 17,
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
      lengthLimitWarning: {
        color: COLORS.ERROR,
        fontWeight: 700,
        marginLeft: 20,
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
        padding: '9px 0',
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
        limitLength: !this.state.limitLength,
      };

      // if turning the limit on and there's no value yet,
      // set a default to the current text length
      if (newProps.limitLength && !this.state.lengthLimit) {
        newProps.lengthLimit = this.state.text.length || 20;
      }

      this.setState(newProps, this.checkLength);
    };

    const handleLengthLimitChange = lengthLimit => {
      this.setState({
        lengthLimit,
        limitLength: !!lengthLimit,
      }, this.checkLength);
    };

    const togglePlainTextOnly = () => {
      this.setState({plainTextOnly: !this.state.plainTextOnly});
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

          <Input
            style={{...styles.numberInput, ...styles.lengthLimitInput}}
            type="number"
            min="0"
            value={this.state.lengthLimit}
            onChange={handleLengthLimitChange}
            onEnter={this.updateBoxAndClose}
          />

          <span style={styles.lengthLimitDesc}>characters</span>
          <span style={styles.lengthLimitWarning}>{this.state.tooLongMessage}</span>
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

          <Input
            id="text-box-id-input"
            defaultValue={box.label}
            disabled={this.state.lockId}
            title={this.state.lockId ? 'This ID has been locked and cannot be changed' : 'This is what identifies the text in the API'}
            style={styles.idInput}
            spellCheck={false}
            onChange={this.onIdChange}
            onEnter={this.updateBoxAndClose}
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
        padding: '0 10px',
        marginTop: 10,
        textTransform: 'uppercase',
        width: DIMENSIONS.SPACE_L * 2,
      },
      previewButtonGuts: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
          onMouseEnter={() => {
            this.setState({peekFormatted: true});
          }}
          onMouseOut={e => {
            if (e.currentTarget.contains(e.relatedTarget)) return;
            this.setState({peekFormatted: false});
          }}
        >
          <span style={styles.previewButtonGuts}>
            <Icon
              icon={ICONS.EYE}
              size={22}
              color={COLORS.WHITE}
            />

            Preview
          </span>
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
        maxHeight: window.innerHeight - 550, // roughly keep the other settings visible on smaller screens
        minHeight: 100, // but not too small
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
        showOk
        okText={'Save'}
        onOk={this.updateBoxAndClose}
        okDisabled={!this.isValid()}
      >
        <div style={styles.textWrapper}>
          <TextArea
            value={this.state.text}
            onChange={this.onTextBoxChange}
            onCtrlEnter={this.updateBoxAndClose}
            style={styles.textInput}
            autoFocus
            limit
            maxLength={this.state.limitLength ? this.state.lengthLimit : undefined}
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
