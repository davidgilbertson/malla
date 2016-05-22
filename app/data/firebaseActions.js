import slug from 'speakingurl';
import {getApp} from './firebaseApp.js';

import {
  ACTIONS,
} from '../constants.js';

let db;
let firebaseApp;
let currentProjectId;
let reduxStore;
let isSignedIn = false;

/*  --  USERS  --  */
function onUserChange(userDataSnapshot) {
  if (userDataSnapshot.val()) {
    reduxStore.dispatch({
      type: ACTIONS.SIGN_IN_USER, // TODO (davidg): .UPDATE_USER ?
      key: userDataSnapshot.key,
      val: userDataSnapshot.val(),
    });
  }
}

function onAuthenticationChange(user) {
  if (user && !isSignedIn) { // user has just signed in
    isSignedIn = true;

    db
      .child('users')
      .child(user.uid)
      .on('value', onUserChange);
  }

  if (isSignedIn && !user) { // user is signing out
    isSignedIn = false;

    reduxStore.dispatch({
      type: ACTIONS.SIGN_OUT,
    });
  }
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

  return firebaseApp.auth().signInWithPopup(provider); // TODO (davidg): on error sign in with redirect
}

export function addUser({uid, user}) {
  const newProjectKey = db.child('data/projects').push().key;
  const newScreenKey = db.child('data/screens').push().key;
  const newBoxKey = db.child('data/boxes').push().key;

  const newUser = {
    ...user,
    currentProjectKey: newProjectKey,
    currentScreenKey: newScreenKey,
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

  const newData = {
    [`users/${uid}`]: newUser,
    [`data/projects/${newProjectKey}`]: newProject,
    [`data/screens/${newScreenKey}`]: newScreen,
    [`data/boxes/${newBoxKey}`]: newBox,
  };

  db.update(newData);
  
  return {
    newUser: {
      key: uid,
      val: newUser,
    },
    newProject: {
      key: newProjectKey,
      val: newProject,
    },
    newScreen: {
      key: newScreenKey,
      val: newScreen,
    },
    newBox: {
      key: newBoxKey,
      val: newBox,
    },
  };
}

export function updateUser(newProps) {
  const state = reduxStore.getState();
  
  return db
    .child('users')
    .child(state.user.uid)
    .update(newProps);
}

export function checkIfUserExists(authData) {
  return db
    .child('users')
    .child(authData.user.uid)
    .once('value')
    .then(dataSnapshot => {
      return Promise.resolve({
        authData,
        userExists: dataSnapshot.exists(),
        existingUser: dataSnapshot.exists() && dataSnapshot.val(),
      });
    });
}

export function signOut() {
  firebaseApp.auth().signOut();
}

// function onProjectKeyAdded(projectSnapshot) {
//   currentProjectId = projectSnapshot.key;
//
//   // TODO (davidg): there is something wrong here. This listener is removed on the first use of the site (after sign up)
//   // if fires a few times on load but then disappears.
//   db.child('data/projects')
//     .child(projectSnapshot.key)
//     .on('value', onProjectChanged);
// }

// function onProjectChanged(projectSnapshot) {
//   reduxStore.dispatch({
//     type: ACTIONS.UPSERT_PROJECT,
//     key: projectSnapshot.key,
//     val: projectSnapshot.val(),
//   });
// }

// export function getMruProject(userId) {
//   return db
//     .child('users')
//     .child(userId)
//     .child('currentProjectKey')
//     .once('value')
//     .then(snapshot => {
//       return db
//         .child('data/projects')
//         .child(snapshot.val())
//         .once('value')
//         .then(snapshot => Promise.resolve({
//           id: snapshot.key,
//           ...snapshot.val(),
//         }));
//     });
// }

// export function addProject(project = {}) {
//   const state = reduxStore.getState();
//   const {userId} = state.user.uid;
//  
//   const newProjectKey = db.child('data/projects').push().key;
//   const newScreenKey = db.child('data/screens').push().key;
//   const newBoxKey = db.child('data/boxes').push().key;
//
//   const newProject = {
//     ...project,
//     lastBoxLabelId: 1,
//     slug: slug(project.name),
//     owner: userId,
//     screenKeys: {
//       [newScreenKey]: true,
//     },
//     boxKeys: {
//       [newBoxKey]: true,
//     },
//   };
//
//   const newScreen = {
//     name: 'Screen 1',
//     description: '',
//     projectKey: newProjectKey,
//     boxKeys: {
//       [newBoxKey]: true,
//     },
//   };
//
//   const newBox = {
//     label: 'title',
//     text: 'Your first text box. Click once to move or resize, click again to edit the text.',
//     height: 50,
//     left: 40,
//     top: 40,
//     width: 570,
//     projectKey: newProjectKey,
//     screenKeys: {
//       [newScreenKey]: true,
//     },
//   };
//
//   const newData = {
//     [`users/${userId}/projectKeys/${newProjectKey}`]: true,
//     [`users/${userId}/currentProjectKey`]: newProjectKey,
//     [`data/projects/${newProjectKey}`]: newProject,
//     [`data/screens/${newScreenKey}`]: newScreen,
//     [`data/boxes/${newBoxKey}`]: newBox,
//   };
//
//   db.update(newData);
//
//   return newProjectKey;
// }


/*  --  BOXES  --  */

export function addBox(box) {
  const state = reduxStore.getState();
  const {currentProjectKey, currentScreenKey, uid} = state.user;

  const newBoxKey = db.child('data/boxes').push().key;

  box.projectKey = currentProjectKey;

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

export function removeBox({boxId, projectId}) {
  db
    .child('data/boxes')
    .child(boxId)
    .remove(err => {
      err && console.warn(`Error removing box from data/boxes/${boxId}:`, err);
    });

  db
    .child('data/projects')
    .child(currentProjectId)
    .child('boxes')
    .child(boxId)
    .remove(err => {
      err && console.warn(`Error removing box from data/projects/${projectId}/boxes/${boxId}:`, err);
    });
}

export function init(store) {
  reduxStore = store;

  firebaseApp = getApp();
  db = firebaseApp.database().ref();

  firebaseApp.auth().onAuthStateChanged(onAuthenticationChange);
}
