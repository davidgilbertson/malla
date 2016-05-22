import {browserHistory} from 'react-router';

import reduxStore from './store.js';
import * as firebaseActions from './firebaseActions.js';
import * as tracker from '../tracker.js';
const mockBoxes = require('./mockBoxes.json');

import {
  ACTIONS,
} from '../constants.js';

const onClient = typeof window !== 'undefined';

export function updateBox(key, val) {
  firebaseActions.updateBox({key, val});
}

export function addBox(dims) {
  const newBox = {
    ...dims,
    text: '',
  };

  const newBoxKey = firebaseActions.addBox(newBox);

  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.DATA_INTERACTION,
    action: tracker.EVENTS.ACTIONS.ADDED_BOX,
  });
  
  return newBoxKey;
}

export function removeBox(boxId) {
  // TODO (davidg): when I have currentProjectId in the store, pass it into this method
  const projectId = firebaseActions.getCurrentProject();

  firebaseActions.removeBox({boxId, projectId});

  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.DATA_INTERACTION,
    action: tracker.EVENTS.ACTIONS.REMOVED_BOX,
  });
}

export function setActiveBox(id, mode) {
  if (!onClient) return;

  return {
    type: ACTIONS.SET_ACTIVE_BOX,
    id,
    mode,
  };
}

export function selectScreen(currentScreenKey) {
  // this should only be called by a change in route
  reduxStore.dispatch({
    type: ACTIONS.CLEAR_BOXES
  });

  firebaseActions.updateUser({currentScreenKey});
}

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

export function createUser(authData) {
  const {uid} = authData;
  const user = parseAuthDataToUserData(authData);
  user.showHelp = true;

  const newObjects = firebaseActions.addUser({uid, user});
  const {newUser, newProject, newScreen, newBox} = newObjects;

  reduxStore.dispatch({
    type: ACTIONS.SIGN_IN_USER,
    ...newUser
  });

  reduxStore.dispatch({
    type: ACTIONS.UPSERT_PROJECT,
    ...newProject
  });

  reduxStore.dispatch({
    type: ACTIONS.UPSERT_SCREEN,
    ...newScreen
  });

  reduxStore.dispatch({
    type: ACTIONS.UPSERT_BOX,
    ...newBox
  });

  return newUser.val;
}

function parseAuthDataToUserData(authData) {
  const providerData = authData.providerData[0] || {};

  return {
    name: providerData.displayName || '',
    profileImageURL: providerData.profileImageURL || providerData.photoURL || '',
    provider: providerData.providerId | '',
  };
}

// function navigateToCurrentScreen() {
//   const state = reduxStore.getState();
//   const {currentProjectKey, currentScreenKey} = state.user;
//   const currentProject = state.projects[currentProjectKey];
//   const currentScreen = state.screens[currentScreenKey];
//
//   const url = `/s/${currentScreenKey}/${currentProject.slug}/${currentScreen.slug}`;
//
//   browserHistory.push(url);
// }

export function signIn(provider) {
  firebaseActions.signIn(provider)
    .then(firebaseActions.checkIfUserExists)
    .then(({authData, userExists, existingUser}) => {
      let action;
      let user;

      if (userExists) {
        action = tracker.EVENTS.ACTIONS.SIGNED_IN;
        user = existingUser;
      } else {
        action = tracker.EVENTS.ACTIONS.SIGNED_UP;
        user = createUser(authData.user);
        // TODO (davidg): else update the record if profile pic or something changed?
      }

      tracker.setUserDetails(user);

      tracker.sendEvent({
        category: tracker.EVENTS.CATEGORIES.SYSTEM,
        action: action,
      });

      // navigateToCurrentScreen();
    })
    .catch(err => {
      console.warn('Error signing in.', err);
    });
}
