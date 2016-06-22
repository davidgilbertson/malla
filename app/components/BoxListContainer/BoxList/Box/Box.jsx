import React from 'react';
const {Component, PropTypes} = React;
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import MarkedDownText from '../../../MarkedDownText/MarkedDownText.jsx';
import BoxActions from '../../../DropModal/BoxActions/BoxActions.jsx';
import TextArea from '../../../TextArea/TextArea.jsx';
import Draggable from './Draggable.jsx';

import {
  css,
  markdownToHtml,
} from '../../../../utils';

import {
  ANIMATION_DURATION,
  BOX_MODES,
  BOX_TYPES,
  COLORS,
  FONT_FAMILIES,
  MODALS,
  TEXT_PADDING,
} from '../../../../constants.js';

const baseStyles = {
  draggable: {
    marginBottom: 200, // so there's always space at the bottom of the page
    ...css.border(1, 'dashed', COLORS.GRAY_LIGHT),
    boxShadow: `0 0 0 1px ${COLORS.WHITE}`, // an 'outside' border of 1 to cover grid dots
    backgroundColor: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SERIF,
    fontSize: 15,
    transition: `border ${ANIMATION_DURATION}ms`,
  },
  deleteButton: {
    position: 'absolute',
    bottom: -6,
    right: -40,
    padding: 5,
    textAlign: 'right',
    color: COLORS.ACCENT,
    fontWeight: 700,
    fontFamily: FONT_FAMILIES.SANS_SERIF,
  },
  textBox: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: TEXT_PADDING,
    opacity: 0,
    transition: `opacity ${ANIMATION_DURATION}ms`,
  },
  textArea: {
    border: 0,
    outline: 0,
    backgroundColor: 'transparent', // stop it overlapping the border in firefox
    resize: 'none',
    ...css.shadow('inset'),
  },
  displayText: {
    overflow: 'auto',
  },
};

class Box extends Component {
  constructor(props) {
    super(props);

    this.onTextAreaChange = this.onTextAreaChange.bind(this);
    this.renderLimitChip = this.renderLimitChip.bind(this);
    this.onTextLimited = this.onTextLimited.bind(this);
    this.exitTypingMode = this.exitTypingMode.bind(this);

    this.state = {
      textWasLimited: false,
    };
  }

  componentDidMount() {
    // a box will mount in typing mode when it's just been added
    if (this.isInTypingMode(this.props)) {
      this.textAreaComp.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    const userWasTyping = this.isInTypingMode(this.props);
    const userWillBeTyping = this.isInTypingMode(nextProps);
    const thereIsNewText = nextProps.box.text !== this.props.box.text;

    // text updated from another user
    if (thereIsNewText && !userWasTyping) {
      this.textAreaComp.setValue(nextProps.box.text);
    }

    // when entering typing mode, make sure it is set correctly
    // in the case that another user changed it
    if (!userWasTyping && userWillBeTyping) {
      this.textAreaComp.setValue(nextProps.box.text);
    }

    // hide the 'text is limited' message
    if (userWasTyping && !userWillBeTyping) {
      this.setState({textWasLimited: false});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) return true;

    const userWasTyping = this.isInTypingMode(this.props);
    const userIsTyping = this.isInTypingMode(nextProps);
    // don't update the component while the textarea is focused (messes with the cursor)
    if (userWasTyping && userIsTyping) {
      return false;
    }

    return (
      nextProps.id !== this.props.id ||
      !isEqual(nextProps.box, this.props.box) ||
      !isEqual(nextProps.activeBox, this.props.activeBox)
    );
  }

  componentDidUpdate(prevProps) {
    const wasNotInTypingMode = !this.isInTypingMode(prevProps);
    const isNowInTypingMode = this.isInTypingMode(this.props);

    if (wasNotInTypingMode && isNowInTypingMode) {
      this.textAreaComp.focus();
    }
  }

  onTextLimited() {
    // TextArea has limited text entry, tell the user why
    this.setState({textWasLimited: true});
  }

  onTextAreaChange(value) {
    this.props.boxActions.update(
      this.props.id,
      {
        text: value,
        html: markdownToHtml(value),
      },
    );
  }

  isInTypingMode({activeBox, id}) {
    return id === activeBox.id && activeBox.mode === BOX_MODES.TYPING;
  }

  exitTypingMode() {
    this.props.boxActions.setActiveBox(null);
    // MS Edge will leave the textarea cursor showing if it isn't blurred.
    document.activeElement && document.activeElement.blur();
  }

  renderBoxActionsDropModal() {
    if (this.props.activeBox.id !== this.props.id) return null;

    const styles = {
      position: 'absolute',
      left: '50%',
      bottom: this.state.textWasLimited ? -55 : -15,
      transition: `bottom ${ANIMATION_DURATION}ms`,
    };

    return (
      <div style={styles}>
        <BoxActions
          id={this.props.id}
          box={this.props.box}
          boxActions={this.props.boxActions}
          showModal={this.props.showModal}
        />
      </div>
    );
  }

  renderLimitChip() {
    const limit = this.props.box.lengthLimit;

    const styles = {
      panel: {
        position: 'absolute',
        width: 200,
        left: '50%',
        top: 'calc(100% + 10px)',
        transform: 'translateX(-50%)',
        height: this.state.textWasLimited ? 30 : 0,
        background: COLORS.ERROR,
        overflow: 'hidden',
        textAlign: 'center',
        transition: `height ${ANIMATION_DURATION}ms`,
        ...css.shadow('small'),
      },
      body: {
        display: 'inline-block',
        paddingTop: 4,
        fontSize: 16,
        color: COLORS.WHITE,
        fontFamily: FONT_FAMILIES.SANS_SERIF,
      },
    };

    return (
      <div
        style={styles.panel}
        onClick={() => this.props.showModal(MODALS.EDIT_BOX)}
      >
        <span style={styles.body}>
          {`Limited to ${limit} character${limit === 1 ? '' : 's'}`}
        </span>
      </div>
    );
  }

  render() {
    const {activeBox, box, boxActions, id, showModal} = this.props;
    const isInTypingMode = this.isInTypingMode(this.props);

    const styles = cloneDeep(baseStyles);

    if (isInTypingMode) {
      styles.draggable.borderWidth = 1;
      styles.draggable.borderStyle = 'solid';
      styles.draggable.borderColor = COLORS.PRIMARY;

      styles.textArea.opacity = 1;
      styles.displayText.pointerEvents = 'none';
    } else {
      styles.displayText.opacity = 1;
    }

    if (box.type === BOX_TYPES.LABEL) {
      styles.draggable = {
        ...styles.draggable,
        color: COLORS.PRIMARY_DARK,
        fontSize: 23, // fits without scrollbar in box that's 40 high
        fontFamily: FONT_FAMILIES.CURSIVE,
        borderColor: COLORS.PRIMARY_LIGHT,
        backgroundColor: 'transparent',
      };

      styles.textArea.padding = 4;
      styles.displayText.padding = 4;
    }

    return (
      <Draggable
        style={styles.draggable}
        left={box.left}
        top={box.top}
        width={box.width}
        height={box.height}
        disableDragging={isInTypingMode}
        onUpdate={newState => boxActions.update(id, newState)}
        onMouseDown={e => {
          if (e.currentTarget.contains(e.target)) return; // don't reset when clicking on tools
          boxActions.setActiveBox(null);
        }}
        onClick={() => boxActions.setActiveBox(id, BOX_MODES.TYPING)}
        onDoubleClick={() => {
          if (!activeBox.id) {
            // if the user double clicks the HANDLE, the the activeBox will not have been set yet.
            boxActions.setActiveBox(id, BOX_MODES.TYPING);
          }
          showModal(MODALS.EDIT_BOX);
        }}
      >
        {this.renderBoxActionsDropModal()}

        <TextArea
          ref={comp => this.textAreaComp = comp}
          style={{...styles.textBox, ...styles.textArea}}
          defaultValue={box.text}
          maxLength={box.limitLength ? box.lengthLimit : 0}
          restrictInput
          onChange={this.onTextAreaChange}
          onCtrlEnter={this.exitTypingMode}
          onEsc={this.exitTypingMode}
          onTextLimited={this.onTextLimited}
        />

        {this.renderLimitChip()}

        <MarkedDownText
          style={{...styles.textBox, ...styles.displayText}}
          markdown={box.text}
          doNotParseMarkdown={box.plainTextOnly}
        />
      </Draggable>
    );
  }
}

Box.propTypes = {
  // props
  activeBox: PropTypes.object.isRequired,
  box: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,

  // methods
  boxActions: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired,
};

export default Box;
