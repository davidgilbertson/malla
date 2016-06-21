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

import {
  ACTIONS,
} from '../constants.js';

import {
  getCurrentProjectAndScreen,
  getUrlForScreenKey,
  makeArray,
} from '../utils';

const onClient = typeof window !== 'undefined';

/*  --  PROJECTS  --  */
export function addProject(project) {
  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.DATA_INTERACTION,
    action: tracker.EVENTS.ACTIONS.ADDED_PROJECT,
  });

  const {newScreenKey} = firebaseActions.addProject(project);

  const url = getUrlForScreenKey(store, newScreenKey);

  // update the URL.
  // routes.js will dispatch navigateToScreen() when the URL changes
  browserHistory.push(url);
}

export function updateProject(key, val) {
  firebaseActions.updateProject({key, val});
}

export function removeProject(key) {
  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.DATA_INTERACTION,
    action: tracker.EVENTS.ACTIONS.REMOVED_PROJECT,
  });

  firebaseActions.removeProject(key);
  navigateToProject(); // sending no key will go to the first project
}

/*  --  SCREENS  --  */
export function addScreen(screen) {
  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.DATA_INTERACTION,
    action: tracker.EVENTS.ACTIONS.ADDED_SCREEN,
  });

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
  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.DATA_INTERACTION,
    action: tracker.EVENTS.ACTIONS.REMOVED_SCREEN,
  });

  firebaseActions.removeScreen(key);
  navigateToScreen(); // sending no key will go to the first screen
}

export function navigateToProject(key) {
  let projectKey = key;

  if (!key) {
    const firstProject = makeArray(store.getState().projects)
      .find(project => project && !project.deleted);

    if (!firstProject) {
      console.warn('Looks like there are no projects at all. Going home');

      firebaseActions.updateUser({
        lastUrl: null,
      });

      browserHistory.push('/');
      return;
    }

    projectKey = firstProject._key;
  }

  const firstScreenInProject = makeArray(store.getState().screens)
    .find(screen => screen && screen.projectKey === projectKey && !screen.deleted);

  const url = getUrlForScreenKey(store, firstScreenInProject._key);

  firebaseActions.updateUser({
    lastUrl: url,
  });

  browserHistory.push(url);
}

export function navigateToScreen(key) {
  let keyToSelect = key;

  if (!key) {
    const {currentProject} = getCurrentProjectAndScreen();
    const firstScreen = makeArray(store.getState().screens)
      .find(screen => screen && !screen.deleted && screen.projectKey === currentProject.key);

    if (!firstScreen) {
      console.warn('Looks like there are no screens at all. Going home');

      firebaseActions.updateUser({
        lastUrl: null,
      });

      browserHistory.push('/');
      return;
    }

    keyToSelect = firstScreen._key;
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

export function hideModal() {
  store.dispatch({
    type: ACTIONS.HIDE_MODAL,
  });
}

export function showDropModal(dropModal) {
  store.dispatch({
    type: ACTIONS.SHOW_DROP_MODAL,
    dropModal,
  });
}

export function hideDropModal() {
  store.dispatch({
    type: ACTIONS.SHOW_DROP_MODAL,
    dropModal: null,
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
