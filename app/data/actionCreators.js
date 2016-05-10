import {browserHistory} from 'react-router';

import * as cloudData from './cloudStoreBindings.js';
import mockBoxes from './mockBoxes.json';
import {
  ACTIONS,
} from '../constants.js';

const onClient = typeof window !== 'undefined';

export function update(boxId, newProps) {
  cloudData
    .getDb()
    .child('data/boxes')
    .child(boxId)
    .update(newProps);
}

export function add(dims) {
  const currentProject = cloudData.getCurrentProject();
  const db = cloudData.getDb();

  const box = {
    ...dims,
    text: '',
  };

  const newBoxRef = db.child('data/boxes').push(box);

  const newBoxId = newBoxRef.key();

  db
    .child('data')
    .child('projects')
    .child(currentProject)
    .child('boxes')
    .child(newBoxId)
    .set(true);

  return newBoxId;
}

export function remove(boxId) {
  const currentProject = cloudData.getCurrentProject();

  cloudData
    .getDb()
    .child('data/boxes')
    .child(boxId)
    .remove(err => {
      err && console.warn(`Error removing box from data/boxes/${boxId}:`, err);
    });

  cloudData
    .getDb()
    .child('data/projects')
    .child(currentProject)
    .child('boxes')
    .child(boxId)
    .remove(err => {
      err && console.warn(`Error removing box from data/projects/${currentProject}/boxes/${boxId}:`, err);
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
  // This will trigger an onAuth() elsewhere that will update the store
  cloudData.getDb().unauth();
  browserHistory.push('/');
}

export function addMockProjectForUser(userId) {
  const db = cloudData.getDb();
  const mockProject = {
    name: 'My project',
    description: 'A project to get you started',
  };

  // get a reference to what will be the new project (note the empty push())
  const newProjectRef = db.child('data/projects').push();

  // add a reference to that project in the user's list of projects
  db
    .child('users')
    .child(userId)
    .child('projects')
    .child(newProjectRef.key())
    .set(true);

  // add the actual project (since it now exists in the user's list of projects)
  db
    .child('data/projects')
    .child(newProjectRef.key())
    .set({
      ...mockProject,
      owner: userId,
    });

  // add some boxes and reference them from the project
  mockBoxes.forEach((mockBox, i) => {
    const boxRef = db.child('data/boxes').push(mockBoxes[i]);
    db
      .child('data/projects')
      .child(newProjectRef.key())
      .child('boxes')
      .child(boxRef.key())
      .set(true);
  });
}

export function createUser(user) {
  cloudData
    .getDb()
    .child('users')
    .child(user.uid)
    .set(user.data);

  addMockProjectForUser(user.uid);
}

function parseAuthDataToUserData(authData, provider) {
  return {
    uid: authData.uid,
    data: {
      name: authData[provider].displayName,
      profileImageURL: authData[provider].profileImageURL,
      provider: provider,
      [provider]: authData[provider],
    },
  };
}

function checkIfUserExists(authData) {
  return cloudData
    .getDb()
    .child('users')
    .child(authData.uid)
    .once('value')
    .then(dataSnapshot => {
      return Promise.resolve({
        authData,
        userExists: dataSnapshot.exists(),
      });
    });
}

export function signIn(provider = 'google') {
  if (!['google', 'facebook', 'twitter'].includes(provider)) {
    console.warn(`The provider '${provider}' is not supported`);
    return;
  }

  cloudData
    .getDb()
    .authWithOAuthPopup(provider)
    .then(checkIfUserExists)
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
