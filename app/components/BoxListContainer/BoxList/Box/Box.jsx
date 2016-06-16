import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';
import cloneDeep from 'lodash/cloneDeep';

import MarkedDownText from '../../../MarkedDownText/MarkedDownText.jsx';
import DropModal from '../../../DropModal/DropModal.jsx';
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
  DROP_MODALS,
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
  boxActions: {
    display: 'none', // made visible when there's an active box
    position: 'absolute',
    left: '50%',
    bottom: -15,
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

    const {box} = this.props;

    this.state = {
      textTooLong: box.limitLength && box.text.length > box.lengthLimit,
    }
  }

  isInTypingMode({activeBox, id}) {
    return id === activeBox.id && activeBox.mode === BOX_MODES.TYPING;
  }

  onTextAreaChange(e) {
    const text = e.target.value;
    const html = markdownToHtml(text);

    const {box} = this.props;

    this.setState({
      textTooLong: box.limitLength && text.length > box.lengthLimit,
    });
    // TODO (davidg): this should be shared with the BoxDetails.jsx so I'm not doing it in two places
    // e.g. RichTextEditor and it outputs {raw, html} onChange
    this.props.boxActions.update(
      this.props.id,
      {
        text,
        html,
      },
    );
  }

  componentDidUpdate(prevProps) {
    const wasNotInTypingMode = !this.isInTypingMode(prevProps);
    const isNowInTypingMode = this.isInTypingMode(this.props);

    if (wasNotInTypingMode && isNowInTypingMode) {
      this.textAreaEl.focus();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) return true;

    const textAreaNotFocused = document.activeElement !== this.textAreaEl;
    const leavingTypingMode = !this.isInTypingMode(nextProps);
    // don't update the component while the textarea is focused (messes with the cursor)
    return textAreaNotFocused || leavingTypingMode;
  }

  componentWillReceiveProps(nextProps) {
    const iAmTyping = document.activeElement === this.textAreaEl;
    const thereIsNewText = nextProps.box.text !== this.props.box.text;

    if (thereIsNewText && !iAmTyping) {
      this.textAreaEl.value = nextProps.box.text;
    }
  }

  componentDidMount() {
    // a box will mount in typing mode when it's just been added
    if (this.isInTypingMode(this.props)) {
      this.textAreaEl.focus();
    }
  }

  render() {
    const {activeBox, box, boxActions, id, showModal} = this.props;
    const isInTypingMode = this.isInTypingMode(this.props);

    const styles = cloneDeep(baseStyles);

    if (isInTypingMode) {
      styles.draggable.borderWidth = 1;
      styles.draggable.borderStyle = 'solid';
      styles.draggable.borderColor = this.state.textTooLong ? COLORS.ERROR : COLORS.PRIMARY;

      styles.textArea.opacity = 1;
      styles.displayText.pointerEvents = 'none';
    } else {
      styles.displayText.opacity = 1;

    }

    if (activeBox.id === id) {
      styles.boxActions.display = 'block';
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
          <div style={styles.boxActions}>
            <DropModal
              currentDropModal={DROP_MODALS.BOX_ACTIONS}
              id={id}
              box={box}
              boxActions={boxActions}
              showModal={showModal}
            />
          </div>

          <textarea
            ref={el => this.textAreaEl = el}
            style={{...styles.textBox, ...styles.textArea}}
            defaultValue={box.text}
            onChange={this.onTextAreaChange}
          />

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
  // state
  activeBox: PropTypes.object.isRequired,
  box: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,

  // actions
  boxActions: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired,
};

export default Radium(Box);
