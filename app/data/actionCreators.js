import * as cloudData from './cloudData.js';

import {
  ACTIONS,
} from '../constants.js';

const onClient = typeof window !== 'undefined';

export function update(id, newProps) {
  const db = cloudData.getDb();

  db.child(`data/boxes/${id}`).update(newProps);
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

  db.child(`data/projects/${currentProject}/boxes/${newBoxId}`).set(true);

  return newBoxId;
}

export function remove(boxId) {
  const currentProject = cloudData.getCurrentProject();

  cloudData.getDb().child(`data/boxes/${boxId}`).remove(err => {
    err && console.warn(`Error removing box from data/boxes/${boxId}:`, err);
  });
  cloudData.getDb().child(`data/projects/${currentProject}/boxes/${boxId}`).remove(err => {
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
  const db = cloudData.getDb();
  // This will trigger an onAuth() elsewhere that will update the store
  db.unauth();
}

export function addMockProjectForUser(userId) {
  const mockProject = {
    name: 'My project',
    description: 'A project to get you started',
  };

  // TODO (davidg): better boxes
  const mockBox1 = {
    top: 10,
    left: 10,
    width: 400,
    height: 50,
    text: 'Hi there, I am your site title',
    label: 'title',
  };

  const mockBox2 = {
    top: 100,
    left: 10,
    width: 400,
    height: 100,
    text: 'I am another text box. You can click us once to move or resize me, click again to edit our text.',
    label: 'desc',
  };

  const db = cloudData.getDb();

  // get a reference to what will be the new project (note the empty push())
  const newProjectRef = db.child('data/projects').push();

  // add a reference to that project in the user's list of projects
  db.child(`users/${userId}/projects/${newProjectRef.key()}`).set(true);

  // add the actual project (since it now exists in the user's list of projects)
  db.child(`data/projects/${newProjectRef.key()}`).set({
    ...mockProject,
    owner: userId,
  });

  // add some boxes
  const box1Ref = db.child('data/boxes').push(mockBox1);
  const box2Ref = db.child('data/boxes').push(mockBox2);

  // reference those boxes from the project
  db.child(`data/projects/${newProjectRef.key()}/boxes/${box1Ref.key()}`).set(true);
  db.child(`data/projects/${newProjectRef.key()}/boxes/${box2Ref.key()}`).set(true);
}

export function createUser(authData) {
  const db = cloudData.getDb();

  // add the user
  db.child(`users/${authData.uid}`).set({
    name: authData.google.displayName,
    provider: 'google',
    google: authData.google,
  });

  addMockProjectForUser(authData.uid);
}

export function signIn(provider = 'google') {
  if (provider !== 'google') {
    console.warn(`The provider '${provider}' is not supported`);
    return;
  }

  const db = cloudData.getDb();

  // This will trigger an .onAuth() elsewhere which will populate the store
  db.authWithOAuthPopup(provider)
    .then(authData => {
      db.child(`users/${authData.uid}`).once('value', dataSnapshot => {
        if (!dataSnapshot.val()) {
          createUser(authData);
        }
      });
    }).catch(err => {
      console.warn('Error signing in.', err);
    });
}
