import {browserHistory} from 'react-router';

import reduxStore from './store.js';
import * as cloudStore from './cloudStoreBindings.js';
import mockBoxes from './mockBoxes.json';
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

  const newBoxId = cloudStore.addBox({
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
  const projectId = cloudStore.getCurrentProject();

  cloudStore.removeBox({boxId, projectId});
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

export function signOut() {
  cloudStore.signOut();

  browserHistory.push('/');
}

export function createUser(authData, provider) {
  const userId = authData.uid;
  const user = parseAuthDataToUserData(authData, provider);

  cloudStore.addUser({userId, user});

  cloudStore.addProject({
    userId,
    project: {
      name: 'My project',
      description: 'A project to get you started',
    },
    boxes: mockBoxes,
  });
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
    .then(({authData, userExists}) => {
      if (!userExists) {
        createUser(authData, provider);
      } else {
        // TODO (davidg): else update the record if profile pic or something changed?
      }

      navigateAfterSignIn(authData.uid);
    })
    .catch(err => {
      console.warn('Error signing in.', err);
    });
}
