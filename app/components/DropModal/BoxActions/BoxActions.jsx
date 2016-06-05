import React from 'react';
const {PropTypes} = React;

import Icon from '../../Icon/Icon.jsx';
import Button from '../../Button/Button.jsx';

import {
  COLORS,
  BOX_TYPES,
  ICONS,
  MODALS,
} from '../../../constants.js';

const BoxActions = props => {
  const styles = {
    back: {
      ...props.styles.back,
      width: 80,
      padding: '5px 5px 7px',
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      cursor: 'default',
    },
    iconButton: {
      padding: 4, // so the blue outline is out a bit
    },
  };

  const editBox = () => {
    props.showModal(MODALS.EDIT_BOX);
  };

  const maybeDeleteBox = () => {
    let sure = true;

    if (props.box.type !== BOX_TYPES.LABEL && props.box.text) {
      sure = window.confirm('If you delete this and it is being used, things will break. Cool?');
    }

    if (sure) {
      props.boxActions.setActiveBox(null);
      props.boxActions.remove(props.id);
    }
  };

  return (
    <div style={styles.back}>
      {props.triangle}

      <Button
        style={styles.iconButton}
        onClick={maybeDeleteBox}
        title="Delete this box"
      >
        <Icon
          icon={ICONS.BIN2}
          color={COLORS.WHITE}
          size={20}
        />
      </Button>
      
      <Button
        style={styles.iconButton}
        onClick={editBox}
      >
        <Icon
          icon={ICONS.PENCIL}
          color={COLORS.WHITE}
          size={20}
        />
      </Button>
    </div>
  )
};

BoxActions.propTypes = {
  // props
  box: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
  triangle: PropTypes.object.isRequired,
  
  // methods
  showModal: PropTypes.func.isRequired,
  boxActions: PropTypes.object.isRequired,
};

export default BoxActions;
