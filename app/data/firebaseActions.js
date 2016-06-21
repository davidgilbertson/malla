import {
  BOX_TYPES,
} from '../constants.js';
import {getApp} from './firebaseApp.js';
import * as tracker from '../tracker.js';
import slug from 'speakingurl';

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
    },
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
  newUser.mruScreenKey = newScreenKey;

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

    const newProps = {
      lastSignIn: new Date().toISOString(),
    };

    if (!existingUser.mruScreenKey) {
      if (!existingUser.screenKeys) {
        console.warn('This user does not have any screenKeys. Something has gone wrong');
      }
      newProps.mruScreenKey = Object.keys(existingUser.screenKeys)[0];
    }

    updateUser(newProps);

    resultUser = existingUser;
    // TODO (davidg): else update the record if profile pic or something changed?
  }

  tracker.setUserDetails(resultUser);

  tracker.sendEvent({
    category: tracker.EVENTS.CATEGORIES.SYSTEM,
    action,
  });

  return Promise.resolve(user);
}

export function handleSignIn(user) {
  return checkIfUserExists(user).then(createOrUpdateUser);
}

function checkIfUserExists(user) {
  return db
    .child('users')
    .child(user.uid)
    .once('value')
    .then(dataSnapshot => Promise.resolve({
      user,
      isNewUser: !dataSnapshot.exists(),
      existingUser: dataSnapshot.exists() && dataSnapshot.val(),
    }));
}

export function signOut() {
  firebaseApp.auth().signOut();
}


/*  --  PROJECTS  --  */

export function addProject(project) {
  const userKey = firebaseApp.auth().currentUser.uid;
  const newProjectKey = db.child('data/projects').push().key;
  const newScreenKey = db.child('data/screens').push().key;

  const newProject = {
    ...project,
    slug: slug(project.name),
    screenKeys: {
      [newScreenKey]: true,
    },
  };

  const newScreen = {
    name: 'Main screen',
    slug: 'main-screen',
    description: '',
    projectKey: newProjectKey,
  };

  const newData = {
    [`users/${userKey}/projectKeys/${newProjectKey}`]: true,
    [`users/${userKey}/screenKeys/${newScreenKey}`]: true,
    [`data/projects/${newProjectKey}`]: newProject,
    [`data/screens/${newScreenKey}`]: newScreen,
  };

  db.update(newData);

  return {newScreenKey};
}

export function updateProject({key, val}) {
  db.child('data/projects').child(key).update(val);
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

    if (project.screenKeys) {
      Object.keys(project.screenKeys).forEach(screenKey => {
        updateData[`data/screens/${screenKey}/deleted`] = deleteDate;
      });
    }

    // When the feature of box linking is in, deleting a project should not delete the boxes on it.
    if (project.boxKeys) {
      Object.keys(project.boxKeys).forEach(boxKey => {
        updateData[`data/boxes/${boxKey}/deleted`] = deleteDate;
      });
    }

    db.update(updateData);
  });
}


/*  --  SCREENS  --  */

export function addScreen(screen, currentProjectKey) {
  const userKey = firebaseApp.auth().currentUser.uid;
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
    [`users/${userKey}/screenKeys/${newScreenKey}`]: true,
    [`users/${userKey}/boxKeys/${newBoxKey}`]: true,
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
  const {uid} = state.user;

  const newBoxKey = db.child('data/boxes').push().key;

  const newBox = {
    ...box,
    projectKey: currentProjectKey,
    screenKeys: {
      [currentScreenKey]: true,
    },
  };

  const newData = {
    [`users/${uid}/boxKeys/${newBoxKey}`]: true,
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
