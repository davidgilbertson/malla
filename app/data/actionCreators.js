import {browserHistory} from 'react-router';

import reduxStore from './store.js';
import * as cloudStore from './cloudStoreBindings.js';
import * as tracker from '../tracker.js';
const mockBoxes = require('./mockBoxes.json');

import {
  ACTIONS,
} from '../constants.js';

const onClient = typeof window !== 'undefined';

export function updateBox(boxId, newProps) {
  cloudStore.updateBox({boxId, newProps});
}

export function addBox(dims) {
  // TODO (davidg): the component should pass the id for the project to add the box to
  // future proof to allow adding boxes to other projects
  const currentProject = cloudStore.getCurrentProject();

  const newBox = {
    ...dims,
    text: '',
  };

  const newBoxId = cloudStore.addBox({
    projectId: currentProject,
    box: newBox,
  });

  // so the box is added instantly, add it to the local store. They will reconcile eventually.
  reduxStore.dispatch({
    type: ACTIONS.UPSERT_BOX,
    box: {
      [newBoxId]: newBox,
    },
  });

  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.DATA_INTERACTION,
    action: tracker.EVENTS.ACTIONS.ADDED_BOX,
  });
  
  return newBoxId;
}

export function removeBox(boxId) {
  // TODO (davidg): when I have currentProjectId in the store, pass it into this method
  const projectId = cloudStore.getCurrentProject();

  cloudStore.removeBox({boxId, projectId});

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

export function selectProject(projectId) {
  // this should only be called by a change in route
  reduxStore.dispatch({
    type: ACTIONS.CLEAR_BOXES
  });

  cloudStore
    .setCurrentProject(projectId)
    .catch(() => {
      browserHistory.push('/');
    });
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

export function updateUser(userId, newProps) {
  cloudStore.updateUser({userId, newProps});
}

export function signOut() {
  cloudStore.signOut();
  
  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.SYSTEM,
    action: tracker.EVENTS.ACTIONS.SIGNED_OUT,
  });

  tracker.setUserDetails(null);

  browserHistory.push('/');
}

export function createUser(authData, provider) {
  const userId = authData.uid;
  const user = parseAuthDataToUserData(authData, provider);
  user.showHelp = true;

  cloudStore.addUser({userId, user});

  const projectId = cloudStore.addProject({
    userId,
    project: {
      name: 'My project',
      description: 'A project to get you started',
    },
  });

  mockBoxes.forEach(box => {
    cloudStore.addBox({
      box,
      projectId,
    });
  });

  return user;
}

function parseAuthDataToUserData(authData, provider) {
  return {
    name: authData[provider].displayName,
    profileImageURL: authData[provider].profileImageURL,
    provider: provider,
    [provider]: authData[provider],
  };
}

function navigateAfterSignIn(userId) {
  cloudStore
    .getMruProject(userId)
    .then(project => {
      const url = `/project/${project.slug}/${project.id}`;
      browserHistory.push(url);
    });

}

export function signIn(provider) {
  cloudStore.signIn(provider)
    .then(cloudStore.checkIfUserExists)
    .then(({authData, userExists, existingUser}) => {
      let action;
      let user;

      if (userExists) {
        action = tracker.EVENTS.ACTIONS.SIGNED_IN;
        user = existingUser;
      } else {
        action = tracker.EVENTS.ACTIONS.SIGNED_UP;
        user = createUser(authData, provider);
        // TODO (davidg): else update the record if profile pic or something changed?
      }

      tracker.setUserDetails(user);

      tracker.sendEvent({
        category: tracker.EVENTS.CATEGORIES.SYSTEM,
        action: action,
      });

      navigateAfterSignIn(authData.uid);
    })
    .catch(err => {
      console.warn('Error signing in.', err);
    });
}
