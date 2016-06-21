import React from 'react';
import Radium from 'radium';

import {
  ICONS,
} from '../../constants.js';

import {
  EVENTS,
} from '../../tracker.js';

import {
  css,
  share,
} from '../../utils';

import SocialIconButton from './SocialIconButton.jsx';

let SocialIcons = props => (
  <span style={{...css.showForTabletPortraitUp()}}>
    <SocialIconButton
      {...props}
      icon={ICONS.FACEBOOK}
      title={MALLA_TEXT.shareFacebookTooltip}
      action={EVENTS.ACTIONS.CLICKED.SHARE_FACEBOOK}
      onClick={share.facebook}
    />
    <SocialIconButton
      {...props}
      icon={ICONS.TWITTER}
      title={MALLA_TEXT.shareTwitterTooltip}
      action={EVENTS.ACTIONS.CLICKED.SHARE_TWITTER}
      onClick={share.twitter}
    />
    <SocialIconButton
      {...props}
      icon={ICONS.LINKEDIN2}
      title={MALLA_TEXT.shareLinkedInTooltip}
      action={EVENTS.ACTIONS.CLICKED.SHARE_LINKEDIN}
      onClick={share.linkedIn}
    />
  </span>
);

SocialIcons = Radium(SocialIcons);

export default SocialIcons;
