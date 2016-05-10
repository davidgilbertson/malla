import {browserHistory} from 'react-router';

import * as cloudData from './cloudStoreBindings.js';
import mockBoxes from './mockBoxes.json';
import {
  ACTIONS,
} from '../constants.js';

const onClient = typeof window !== 'undefined';

export function updateBox(boxId, newProps) {
  cloudData.updateBox({boxId, newProps});
}

export function addBox(dims) {
  // TODO (davidg): the component should pass the id for the project to add the box to
  // future proof to allow adding boxes to other projects
  const currentProject = cloudData.getCurrentProject();

  const newBoxId = cloudData.addBox({
    projectId: currentProject,
    box: {
      ...dims,
      text: '',
    },
  });

  return newBoxId;
}

export function removeBox(boxId) {
  // TODO (davidg): when I have currentProjectId in the store, pass it into this method
  const projectId = cloudData.getCurrentProject();

  cloudData.removeBox({boxId, projectId});
}

export function setActiveBox(id, mode) {
  if (!onClient) return;

  return {
    type: ACTIONS.SET_ACTIVE_BOX,
    id,
    mode,
  };
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

export function signOut() {
  cloudData.signOut();

  browserHistory.push('/');
}

export function addMockProjectForUser(userId) {
  const mockProject = {
    name: 'My project',
    description: 'A project to get you started',
  };

  cloudData.addProject({
    userId,
    project: mockProject,
    boxes: mockBoxes,
  });
}

export function createUser({userId, user}) {
  cloudData.addUser({userId, user});

  addMockProjectForUser(userId);
}

function parseAuthDataToUserData(authData, provider) {
  return {
    userId: authData.uid,
    user: {
      name: authData[provider].displayName,
      profileImageURL: authData[provider].profileImageURL,
      provider: provider,
      [provider]: authData[provider],
    },
  };
}

export function signIn(provider) {
  cloudData.signIn(provider)
    .then(cloudData.checkIfUserExists)
    .then(({authData, userExists}) => {
      if (!userExists) {
        createUser(parseAuthDataToUserData(authData, provider));
      }
      // TODO (davidg): else update the record if profile pic or something changed?
    })
    .catch(err => {
      console.warn('Error signing in.', err);
    });
}
