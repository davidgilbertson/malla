import React from 'react';
const {PropTypes} = React;
import Radium from 'radium';

import {
  BREAKPOINTS,
  COLORS,
} from '../../constants.js';
import {EVENTS} from '../../tracker.js';
import {share} from '../../utils';
import Button from '../Button/Button.jsx';
import Icon from '../Icon/Icon.jsx';

let SocialIcons = props => {
  const styles = {
    headerButton: {
      height: props.buttonHeight,
      color: COLORS.WHITE,
      background: COLORS.PRIMARY,
      padding: '0 8px',
      marginRight: 10,
    },
    showForTabletLandscapeUp: {
      display: 'none',
      [BREAKPOINTS.TABLET_LANDSCAPE]: {
        display: 'initial',
      },
    },
  };

  const makeButton = ({icon, title, action, onClick}) => {
    return (
      <Button
        style={styles.headerButton}
        title={title}
        category={EVENTS.CATEGORIES.UI_INTERACTION}
        action={action}
        label="Header button"
        onClick={onClick}
      >
        <Icon
          color={COLORS.WHITE}
          icon={icon}
          size={22}
        />
      </Button>
    );
  };

  const facebookButton = makeButton({
    icon: 'facebook',
    title: 'Share Malla on Facebook',
    action: EVENTS.ACTIONS.CLICKED.SHARE_FACEBOOK,
    onClick: share.facebook,
  });

  const twitterButton = makeButton({
    icon: 'twitter',
    title: 'Tweet about Malla',
    action: EVENTS.ACTIONS.CLICKED.SHARE_TWITTER,
    onClick: share.twitter,
  });

  const linkedInButton = makeButton({
    icon: 'linkedin2',
    title: 'Share on LinkedIn',
    action: EVENTS.ACTIONS.CLICKED.SHARE_LINKEDIN,
    onClick: share.linkedIn,
  });

  return (
    <span style={styles.showForTabletLandscapeUp}>
      {facebookButton}
      {twitterButton}
      {linkedInButton}
    </span>
  );
};

SocialIcons.propTypes = {
  buttonHeight: PropTypes.number.isRequired,
};

SocialIcons = Radium(SocialIcons);

export default SocialIcons;
