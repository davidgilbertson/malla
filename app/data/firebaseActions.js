import {getApp} from './firebaseApp.js';
import * as tracker from '../tracker.js';

let db;
let firebaseApp;
let reduxStore;

/*  --  USERS  --  */

function normalizeProviderData(rawUser) {
  const providerData = rawUser.providerData[0] || {};

  return {
    uid: rawUser.uid,
    name: providerData.displayName || '',
    email: providerData.email || '',
    profileImageURL: providerData.profileImageURL || providerData.photoURL || '',
    provider: providerData.providerId || '',
  };
}

function createUser(providerUser) {
  const {uid} = providerUser;
  const user = normalizeProviderData(providerUser);
  
  const newProjectKey = db.child('data/projects').push().key;
  const newScreenKey = db.child('data/screens').push().key;
  const newBoxKey = db.child('data/boxes').push().key;
  const now = new Date().toISOString();

  const newUser = {
    ...user,
    showHelp: true,
    currentProjectKey: newProjectKey,
    currentScreenKey: newScreenKey,
    dateCreated: now,
    lastSignIn: now,
    projectKeys: {
      [newProjectKey]: true,
    },
    screenKeys: {
      [newScreenKey]: true,
    },
    boxKeys: {
      [newBoxKey]: true,
    }
  };

  const newProject = {
    name: 'Project 1',
    description: '',
    lastBoxLabelId: 1,
    slug: 'project-1',
    screenKeys: {
      [newScreenKey]: true,
    },
    boxKeys: {
      [newBoxKey]: true,
    },
  };

  const newScreen = {
    name: 'Screen 1',
    description: '',
    slug: 'screen-1',
    projectKey: newProjectKey,
    boxKeys: {
      [newBoxKey]: true,
    },
  };

  const newBox = {
    label: 'title',
    text: 'Your first text box. Click once to move or resize, click again to edit the text.',
    height: 50,
    left: 40,
    top: 40,
    width: 570,
    projectKey: newProjectKey,
    screenKeys: {
      [newScreenKey]: true,
    },
  };

  newUser.lastUrl = `/s/${newScreenKey}/${newProject.slug}/${newScreen.slug}`;

  const newData = {
    [`users/${uid}`]: newUser,
    [`data/projects/${newProjectKey}`]: newProject,
    [`data/screens/${newScreenKey}`]: newScreen,
    [`data/boxes/${newBoxKey}`]: newBox,
  };

  db.update(newData);
  
  return newUser;
}

export function signIn(providerString) {
  let provider;

  switch (providerString) {
    case 'facebook':
      provider = new firebaseApp.auth.FacebookAuthProvider();
      break;
    case 'google':
      provider = new firebaseApp.auth.GoogleAuthProvider();
      break;
    case 'twitter':
      provider = new firebaseApp.auth.TwitterAuthProvider();
      break;
    default:
      console.warn(`The provider '${providerString}' is not supported`);
      return Promise.reject(`The provider '${providerString}' is not supported`);
  }

  return firebaseApp
    .auth()
    .signInWithPopup(provider)
    // Note that the sign in isn't processed here. It's in firebaseWatcher.js
    .catch(err => {
      err && console.warn('Error signing in:', err);

      firebaseApp
        .auth()
        .signInWithRedirect(provider);
    });
}

export function updateUser(newProps) {
  const userKey = firebaseApp.auth().currentUser.uid;

  return db
    .child('users')
    .child(userKey)
    .update(newProps);
}

function createOrUpdateUser({user, isNewUser, existingUser}) {
  let resultUser;
  let action;

  if (isNewUser) {
    action = tracker.EVENTS.ACTIONS.SIGNED_UP;

    resultUser = createUser(user);
  } else {
    action = tracker.EVENTS.ACTIONS.SIGNED_IN;

    updateUser({
      lastSignIn: new Date().toISOString(),
    });

    resultUser = existingUser;
    // TODO (davidg): else update the record if profile pic or something changed?
  }

  tracker.setUserDetails(resultUser);

  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.SYSTEM,
    action: action,
  });

  return Promise.resolve(resultUser);
}

export function handleSignIn(user) {
  return checkIfUserExists(user).then(createOrUpdateUser);
}

function checkIfUserExists(user) {
  return db
    .child('users')
    .child(user.uid)
    .once('value')
    .then(dataSnapshot => {
      return Promise.resolve({
        user,
        isNewUser: !dataSnapshot.exists(),
        existingUser: dataSnapshot.exists() && dataSnapshot.val(),
      });
    });
}

export function signOut() {
  firebaseApp.auth().signOut();
}


/*  --  BOXES  --  */

export function addBox(box) {
  const state = reduxStore.getState();
  const {currentProjectKey, currentScreenKey, uid} = state.user;

  const newBoxKey = db.child('data/boxes').push().key;

  box.projectKey = currentProjectKey;
  box.screenKeys = {
    [currentScreenKey]: true,
  };

  const newData = {
    [`users/${uid}/boxKeys/${newBoxKey}`]: true,
    [`data/projects/${currentProjectKey}/boxKeys/${newBoxKey}`]: true,
    [`data/screens/${currentScreenKey}/boxKeys/${newBoxKey}`]: true,
    [`data/boxes/${newBoxKey}`]: box,
  };

  if (!box.label) {
    const project = state.projects[currentProjectKey];
    const lastBoxLabelId = (project.lastBoxLabelId || 0) + 1;

    box.label = `label${lastBoxLabelId}`;
    newData[`data/projects/${currentProjectKey}/lastBoxLabelId`] = lastBoxLabelId + 1;
  }

  db.update(newData);

  return newBoxKey;
}

export function updateBox({key, val}) {
  db
    .child('data/boxes')
    .child(key)
    .update(val);
}

export function removeBox(boxKey) {
  const userKey = firebaseApp.auth().currentUser.uid;

  db.child('data/boxes').child(boxKey).once('value', boxSnapshot => {
    const box = boxSnapshot.val();

    if (!box) return console.warn(`No box with key '${boxKey}' exists`);

    const updateData = {
      [`data/boxes/${boxKey}`]: null,
      [`data/projects/${box.projectKey}/boxKeys/${boxKey}`]: null,
      [`users/${userKey}/boxKeys/${boxKey}`]: null,
    };

    Object.keys(box.screenKeys).forEach(screenKey => {
      updateData[`data/screens/${screenKey}/boxKeys/${boxKey}`] = null;
    });

    db.update(updateData);
  });
}

export function sendFeedback(feedback) {
  db.child('metadata/feedback').push({
    comment: feedback,
    date: new Date().toISOString(),
    user: reduxStore.getState().user,
  });
}

export function init(store) {
  reduxStore = store;

  firebaseApp = getApp();
  db = firebaseApp.database().ref();
}
