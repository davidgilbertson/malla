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
  const currentSite = cloudData.getCurrentSite();
  const db = cloudData.getDb();

  const box = {
    ...dims,
    text: '',
  };

  const newBoxRef = db.child('data/boxes').push(box);

  const newBoxId = newBoxRef.key();

  db.child(`data/sites/${currentSite}/boxes/${newBoxId}`).set(true);

  return newBoxId;
}

export function remove(boxId) {
  const currentSite = cloudData.getCurrentSite();

  cloudData.getDb().child(`data/boxes/${boxId}`).remove(err => {
    err && console.warn(`Error removing box from data/boxes/${boxId}:`, err);
  });
  cloudData.getDb().child(`data/sites/${currentSite}/boxes/${boxId}`).remove(err => {
    err && console.warn(`Error removing box from data/sites/${currentSite}/boxes/${boxId}:`, err);
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

export function addMockSiteForUser(userId) {
  const mockSite = {
    name: 'My first site',
    description: 'A site to get you started',
  };

  // TODO (davidg): better boxes
  const mockBox1 = {
    top: 10,
    left: 10,
    width: 400,
    height: 50,
    text: 'Your site title goes here',
    label: 'title',
  };

  const mockBox2 = {
    top: 100,
    left: 10,
    width: 400,
    height: 100,
    text: 'Some more text goes here. Click a text box once to move/resize, click again to edit the text.',
    label: 'desc',
  };

  const db = cloudData.getDb();

  // get a reference to what will be the new site (note the empty push())
  const newSiteRef = db.child('data/sites').push();

  // add a reference to that site in the user's list of sites
  db.child(`users/${userId}/sites/${newSiteRef.key()}`).set(true);

  // add the actual site (since it now exists in the user's list of sites)
  db.child(`data/sites/${newSiteRef.key()}`).set({
    ...mockSite,
    owner: userId,
  });

  // add some boxes
  const box1Ref = db.child('data/boxes').push(mockBox1);
  const box2Ref = db.child('data/boxes').push(mockBox2);

  // reference those boxes from the site
  db.child(`data/sites/${newSiteRef.key()}/boxes/${box1Ref.key()}`).set(true);
  db.child(`data/sites/${newSiteRef.key()}/boxes/${box2Ref.key()}`).set(true);
}

export function createUser(authData) {
  const db = cloudData.getDb();

  // add the user
  db.child(`users/${authData.uid}`).set({
    name: authData.google.displayName,
    provider: 'google',
    google: authData.google,
  });

  addMockSiteForUser(authData.uid);
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
