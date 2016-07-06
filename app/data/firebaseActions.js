import {
  BOX_TYPES,
  ROLES,
} from '../constants.js';

import {
  getPublicUserProps,
  getRandomString,
} from '../utils';

import {getApp} from './firebaseApp.js';
import * as tracker from '../tracker.js';
import slug from 'speakingurl';

let db;
let firebaseApp;
let reduxStore;

/*  --  USERS  --  */

function normalizeProviderUser(providerUser) {
  const providerData = providerUser.providerData[0] || {};

  return {
    uid: providerUser.uid,
    name: providerData.displayName || '',
    email: providerData.email || '',
    profileImageURL: providerData.profileImageURL || providerData.photoURL || '',
    provider: providerData.providerId || '',
  };
}

function createUser(providerUser) {
  const {uid} = providerUser;
  const user = normalizeProviderUser(providerUser);

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
      [newProjectKey]: ROLES.OWNER,
    },
  };

  // TODO (davidg): centralise this project/screen/box creation, it's done for adding a project too
  const newProject = {
    name: 'My project',
    description: '',
    lastBoxLabelId: 1,
    slug: 'my-project',
    requireApiKey: true,
    apiKey: getRandomString(),
    users: {
      [uid]: {
        ...getPublicUserProps(newUser),
        role: ROLES.OWNER,
      },
    },
    screenKeys: {
      [newScreenKey]: true,
    },
    boxKeys: {
      [newBoxKey]: true,
    },
  };

  const newScreen = {
    name: 'Main screen',
    description: '',
    slug: 'main-screen',
    projectKey: newProjectKey,
    boxKeys: {
      [newBoxKey]: true,
    },
  };

  const newBox = {
    label: 'exampleTextItem',
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
      provider.addScope('email');
      break;
    case 'google':
      provider = new firebaseApp.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
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

export function logUserSignIn(providerUser) {
  const mallaUser = normalizeProviderUser(providerUser);

  const userRef = db.child('users').child(providerUser.uid);
  const newSignInKey = userRef.child('signIns').push().key;
  const now = new Date().toISOString();

  const updatedUser = {
    name: mallaUser.name,
    email: mallaUser.email,
    profileImageURL: mallaUser.profileImageURL,
    lastSignIn: now,
    [`signIns/${newSignInKey}`]: now,
  };

  userRef.update(updatedUser);
}

function createOrUpdateUser({providerUser, isNewUser, existingUser}) {
  let resultUser;
  let action;

  if (isNewUser) {
    action = tracker.EVENTS.ACTIONS.SIGNED_UP;

    resultUser = createUser(providerUser);
  } else {
    action = tracker.EVENTS.ACTIONS.SIGNED_IN;

    logUserSignIn(providerUser);

    resultUser = existingUser;
  }

  tracker.setUserDetails(resultUser);

  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.SYSTEM,
    action,
  });

  return Promise.resolve(providerUser);
}

export function handleSignIn(providerUser) {
  return checkIfUserExists(providerUser).then(createOrUpdateUser);
}

function checkIfUserExists(providerUser) {
  return db
    .child('users')
    .child(providerUser.uid)
    .once('value')
    .then(dataSnapshot => Promise.resolve({
      providerUser,
      isNewUser: !dataSnapshot.exists(),
      existingUser: dataSnapshot.exists() && dataSnapshot.val(),
    }));
}

export function signOut() {
  firebaseApp.auth().signOut();
}


/*  --  PROJECTS  --  */

export function addProject(project = {}) {
  // TODO (davidg): will I EVER pass in a project object? Cloning one day?
  const currentUser = reduxStore.getState().user;
  const userKey = firebaseApp.auth().currentUser.uid;
  const newProjectKey = db.child('data/projects').push().key;
  const newScreenKey = db.child('data/screens').push().key;
  const newBoxKey = db.child('data/boxes').push().key;

  const newProject = {
    name: project.name || 'My project',
    description: '',
    lastBoxLabelId: 1,
    slug: slug(project.name || 'My project'),
    requireApiKey: true,
    apiKey: getRandomString(),
    users: {
      [currentUser.uid]: {
        ...getPublicUserProps(currentUser),
        role: ROLES.OWNER,
      },
    },
    screenKeys: {
      [newScreenKey]: true,
    },
    boxKeys: {
      [newBoxKey]: true,
    },
  };

  const newScreen = {
    name: 'Main screen',
    slug: 'main-screen',
    description: '',
    projectKey: newProjectKey,
    boxKeys: {
      [newBoxKey]: true,
    },
  };

  const newBox = {
    height: 40,
    label: `${newScreen.slug}-label`,
    type: BOX_TYPES.LABEL,
    left: 20,
    text: newScreen.name, // don't put the project name in the label because it will always be 'My project'
    top: 20,
    width: 500,
    projectKey: newProjectKey,
    screenKeys: {
      [newScreenKey]: true,
    },
  };

  const newData = {
    [`users/${userKey}/projectKeys/${newProjectKey}`]: ROLES.OWNER,
    [`data/projects/${newProjectKey}`]: newProject,
    [`data/screens/${newScreenKey}`]: newScreen,
    [`data/boxes/${newBoxKey}`]: newBox,
  };

  db.update(newData);

  return {newScreenKey};
}

export function updateProject({key, val}) {
  db.child('data/projects').child(key).update(val);
}

export function addUserToProject({projectKey, role, userKey, user}) {
  const projectUser = {
    ...user,
    role,
  };

  const newData = {
    [`data/projects/${projectKey}/users/${userKey}`]: projectUser,
    [`users/${userKey}/projectKeys/${projectKey}`]: role,
  };

  db.update(newData);
}

export function removeUserFromProject({projectKey, userKey}) {
  // can't just remove the project record from the user because
  // we need to trigger it to be removed from their localStorage next time they connect
  const updateData = {
    [`data/projects/${projectKey}/users/${userKey}/role`]: ROLES.NO_ACCESS,
    [`users/${userKey}/projectKeys/${projectKey}`]: ROLES.NO_ACCESS,
  };

  db.update(updateData);
}

export function removeProject(projectKey) {
  const deleteDate = new Date().toISOString();

  db.child('data/projects').child(projectKey).once('value', projectSnapshot => {
    const project = projectSnapshot.val();

    if (!project) {
      console.warn(`No project with projectKey '${projectKey}' exists`);
      return;
    }

    const updateData = {
      [`data/projects/${projectKey}/deleted`]: deleteDate,
    };

    Object.keys(project.screenKeys || {}).forEach(screenKey => {
      updateData[`data/screens/${screenKey}/deleted`] = deleteDate;
    });

    // When the feature of box linking is in, deleting a project should not delete the boxes on it.
    Object.keys(project.boxKeys || {}).forEach(boxKey => {
      updateData[`data/boxes/${boxKey}/deleted`] = deleteDate;
    });

    db.update(updateData);
  });
}


/*  --  SCREENS  --  */

export function addScreen(screen, currentProjectKey) {
  const newScreenKey = db.child('data/screens').push().key;
  const newBoxKey = db.child('data/boxes').push().key;

  const newScreen = {
    ...screen,
    projectKey: currentProjectKey,
    slug: slug(screen.name),
    boxKeys: {
      [newBoxKey]: true,
    },
  };

  const newBox = {
    height: 40,
    label: `${newScreen.slug}-label`,
    type: BOX_TYPES.LABEL,
    left: 20,
    text: newScreen.name,
    top: 20,
    width: 500,
    projectKey: currentProjectKey,
    screenKeys: {
      [newScreenKey]: true,
    },
  };

  const newData = {
    [`data/projects/${currentProjectKey}/screenKeys/${newScreenKey}`]: true,
    [`data/projects/${currentProjectKey}/boxKeys/${newBoxKey}`]: true,
    [`data/screens/${newScreenKey}`]: newScreen,
    [`data/boxes/${newBoxKey}`]: newBox,
  };

  db.update(newData);

  return {
    key: newScreenKey,
    val: newScreen,
  };
}

export function updateScreen({key, val}) {
  db.child('data/screens').child(key).update(val);
}

export function removeScreen(screenKey) {
  const deleteDate = new Date().toISOString();

  db.child('data/screens').child(screenKey).once('value', screenSnapshot => {
    const screen = screenSnapshot.val();

    if (!screen) {
      console.warn(`No screen with screenKey '${screenKey}' exists`);
      return;
    }

    const updateData = {
      [`data/screens/${screenKey}/deleted`]: deleteDate,
    };

    // When the feature of box linking is in, deleting a screen should not delete the boxes on it.
    if (screen.boxKeys) {
      Object.keys(screen.boxKeys).forEach(boxKey => {
        updateData[`data/boxes/${boxKey}/deleted`] = deleteDate;
      });
    }

    db.update(updateData);
  });
}


/*  --  BOXES  --  */

export function addBox(box) {
  const state = reduxStore.getState();
  const currentScreenKey = state.currentScreenKey;
  const currentProjectKey = state.screens[currentScreenKey].projectKey;

  const newBoxKey = db.child('data/boxes').push().key;

  const newBox = {
    ...box,
    projectKey: currentProjectKey,
    screenKeys: {
      [currentScreenKey]: true,
    },
  };

  const newData = {
    [`data/projects/${currentProjectKey}/boxKeys/${newBoxKey}`]: true,
    [`data/screens/${currentScreenKey}/boxKeys/${newBoxKey}`]: true,
    [`data/boxes/${newBoxKey}`]: newBox,
  };

  if (!newBox.label) {
    const project = state.projects[currentProjectKey];
    const lastBoxLabelId = (project.lastBoxLabelId || 0) + 1;

    newBox.label = `label${lastBoxLabelId}`;
    newData[`data/projects/${currentProjectKey}/lastBoxLabelId`] = lastBoxLabelId;
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
  db.child('data/boxes').child(boxKey).update({
    deleted: new Date().toISOString(),
    label: `deleted-${+new Date()}`,
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
