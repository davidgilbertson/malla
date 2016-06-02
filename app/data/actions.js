/**
 * This module contains functions that:
 * - dispatch to the store (for UI states)
 * - call a firebaseAction (for persistent data)
 * - trigger an analytics event
 * - redirect to another URL (changing screens, logging out)
 */

import {browserHistory} from 'react-router';

import store from './store.js';
import * as firebaseActions from './firebaseActions.js';
import * as tracker from '../tracker.js';
const mockBoxes = require('./mockBoxes.json');

import {
  ACTIONS,
} from '../constants.js';

import {
  getUrlForScreenKey,
} from '../utils';

const onClient = typeof window !== 'undefined';

/*  --  SCREENS  --  */
export function addScreen(screen) {
  const storeState = store.getState();
  const currentScreenKey = storeState.currentScreenKey;
  const currentProjectKey = storeState.screens[currentScreenKey].projectKey;

  const newScreen = firebaseActions.addScreen(screen, currentProjectKey);

  const url = getUrlForScreenKey(store, newScreen.key);

  // update the URL.
  // routes.js will dispatch navigateToScreen() when the URL changes
  browserHistory.push(url);
}

export function updateScreen(key, val) {
  firebaseActions.updateScreen({key, val});
}

export function removeScreen(key) {
  firebaseActions.removeScreen(key);
  navigateToScreen(); // sending no key will go to the first screen
}

export function navigateToScreen(key) {
  let keyToSelect = key;

  if (!key) {
    keyToSelect = Object.keys(store.getState().screens)[0];
  }

  const url = getUrlForScreenKey(store, keyToSelect);

  firebaseActions.updateUser({
    lastUrl: url,
  });

  browserHistory.push(url);
}

/*  --  BOXES  --  */
export function addBox(box) {
  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.DATA_INTERACTION,
    action: tracker.EVENTS.ACTIONS.ADDED_BOX,
  });

  return firebaseActions.addBox({
    ...box,
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

  store.dispatch({
    type: ACTIONS.SET_ACTIVE_BOX,
    id,
    mode,
  });
}

/*  --  UI  --  */
export function setInteraction(interaction) {
  store.dispatch({
    type: ACTIONS.SET_INTERACTION,
    interaction,
  });
}

export function showModal(modal) {
  store.dispatch({
    type: ACTIONS.SHOW_MODAL,
    modal,
  });
}

export function showDropModal(dropModal) {
  store.dispatch({
    type: ACTIONS.SHOW_DROP_MODAL,
    dropModal,
  });
}

export function hideModal() {
  store.dispatch({
    type: ACTIONS.HIDE_MODAL,
  });
}

export function selectTool(tool) {
  store.dispatch({
    type: ACTIONS.SELECT_TOOL,
    tool,
  });
}

/*  --  USERS  --  */
export function signIn(provider) {
  firebaseActions.signIn(provider);
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

export function sendFeedback(feedback) {
  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.SYSTEM,
    action: tracker.EVENTS.ACTIONS.SENT_FEEDBACK,
  });

  firebaseActions.sendFeedback(feedback);
}
