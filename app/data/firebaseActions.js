import {getApp} from './firebaseApp.js';

let db;
let firebaseApp;
let reduxStore;

/*  --  USERS  --  */

function normalizeProviderData(authData) {
  const providerData = authData.providerData[0] || {};

  return {
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
    .then(checkIfUserExists)
    .then(({authData, isNewUser, existingUser}) => {
      let user;

      if (isNewUser) {
        user = createUser(authData.user);
      } else {
        updateUser({
          lastSignIn: new Date().toISOString(),
        });
        user = existingUser;
        // TODO (davidg): else update the record if profile pic or something changed?
      }

      return Promise.resolve({user, isNewUser});
    });
}

export function updateUser(newProps) {
  const userKey = firebaseApp.auth().currentUser.uid;

  return db
    .child('users')
    .child(userKey)
    .update(newProps);
}

function checkIfUserExists(authData) {
  return db
    .child('users')
    .child(authData.user.uid)
    .once('value')
    .then(dataSnapshot => {
      return Promise.resolve({
        authData,
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

export function init(store) {
  reduxStore = store;

  firebaseApp = getApp();
  db = firebaseApp.database().ref();
}
