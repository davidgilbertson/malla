/**
 * This module contains a mix of functions that:
 * - return an action
 * - call a firebaseAction and perhaps send an analytics event
 * - functions that don't return actions should probably be in their own file
 * - is there a reason they're not just in firebaseActions.js?
 * - that file can send to tracker, why not?
 */

import {browserHistory} from 'react-router';

import * as firebaseActions from './firebaseActions.js';
import * as tracker from '../tracker.js';
const mockBoxes = require('./mockBoxes.json');

import {
  ACTIONS,
} from '../constants.js';

const onClient = typeof window !== 'undefined';

/*  --  BOXES  --  */
export function addBox(dims) {
  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.DATA_INTERACTION,
    action: tracker.EVENTS.ACTIONS.ADDED_BOX,
  });
  
  return firebaseActions.addBox({
    ...dims,
    text: '',
  });
}

export function updateBox(key, val) {
  firebaseActions.updateBox({key, val});
}

export function removeBox(boxKey) {
  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.DATA_INTERACTION,
    action: tracker.EVENTS.ACTIONS.REMOVED_BOX,
  });
 
  firebaseActions.removeBox(boxKey);
}

export function setActiveBox(id, mode) {
  if (!onClient) return;

  return {
    type: ACTIONS.SET_ACTIVE_BOX,
    id,
    mode,
  };
}


/*  --  UI  --  */
export function setInteraction(interaction) {
  return {
    type: ACTIONS.SET_INTERACTION,
    interaction,
  };
}

export function showModal(modal) {
  return {
    type: ACTIONS.SHOW_MODAL,
    modal,
  };
}

export function hideModal() {
  return {
    type: ACTIONS.HIDE_MODAL,
  };
}

/*  --  USERS  --  */
export function signIn(provider) {
  firebaseActions
    .signIn(provider)
    .then(({user, isNewUser}) => {
      let action;

      if (isNewUser) {
        action = tracker.EVENTS.ACTIONS.SIGNED_UP;
      } else {
        action = tracker.EVENTS.ACTIONS.SIGNED_IN;
      }

      tracker.setUserDetails(user);

      tracker.sendEvent({
        category: tracker.EVENTS.CATEGORIES.SYSTEM,
        action: action,
      });
    })
    .catch(err => {
      console.warn('Error signing in.', err);
    });
}

export function updateUser(newProps) {
  firebaseActions.updateUser(newProps);
}

export function signOut() {
  firebaseActions.signOut();
  
  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.SYSTEM,
    action: tracker.EVENTS.ACTIONS.SIGNED_OUT,
  });

  tracker.setUserDetails(null);

  browserHistory.push('/');
}
