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

function onProjectKeyAdded(projectSnapshot) {
  currentProjectId = projectSnapshot.key;

  // TODO (davidg): there is something wrong here. This listener is removed on the first use of the site (after sign up)
  // if fires a few times on load but then disappears.
  db.child('data/projects')
    .child(projectSnapshot.key)
    .on('value', onProjectChanged);
}

function onProjectChanged(projectSnapshot) {
  reduxStore.dispatch({
    type: ACTIONS.UPSERT_PROJECT,
    key: projectSnapshot.key,
    val: projectSnapshot.val(),
  });
}

// export function setCurrentProject(projectId) {
//   const state = reduxStore.getState();
//   const {userId} = state.user.uid;
//   // this should only be called as a result of a route change
//
//   // by looking for the projectId and returning the promise,
//   // we can catch a project-not-found error in the calling function and behave appropriately
//   db
//     .child('users')
//     .child(userId)
//     .child('currentProjectKey')
//     .set(projectId);
//
//   // return db
//   //   .child('data/projects')
//   //   .child(projectId)
//   //   .once('value')
//   //   .then(() => {
//   //     // this never fires if projectId doesn't exist or permission denied
//   //     if (currentProjectId && currentProjectId !== projectId) {
//   //       // stop listening for box changes on a previous project
//   //       db.child(`data/projects/${currentProjectId}/boxes`).off('child_added', onBoxKeyAdded);
//   //       db.child(`data/projects/${currentProjectId}/boxes`).off('child_removed', onBoxKeyRemoved);
//   //     }
//   //
//   //     currentProjectId = projectId;
//   //
//   //     db.child(`data/projects/${projectId}/boxes`).on('child_added', onBoxKeyAdded);
//   //     db.child(`data/projects/${projectId}/boxes`).on('child_removed', onBoxKeyRemoved);
//   //   });
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
// function onBoxKeyAdded(boxSnapshot) {
//   db
//     .child('data/boxes')
//     .child(boxSnapshot.key)
//     .on('value', onBoxChanged);
// }
//
// function onBoxKeyRemoved(boxSnapshot) {
//   reduxStore.dispatch({
//     type: ACTIONS.REMOVE_BOX,
//     id: boxSnapshot.key,
//   });
// }

// function onBoxChanged(boxSnapshot) {
//   if (!boxSnapshot.val()) return; // when a box is first pushed as a ref it is null
//
//   reduxStore.dispatch({
//     type: ACTIONS.UPSERT_BOX,
//     box: {
//       [boxSnapshot.key]: boxSnapshot.val(),
//     },
//   });
// }

export function addBox(box) {
  const state = reduxStore.getState();
  const {currentProjectKey, currentScreenKey, uid} = state.user;

  // get a ref to the project that the box belongs in
  // const projectRef = db
  //   .child('data/projects')
  //   .child(projectId);

  // get a ref to the new box to return the ID immediately (the actual box gets created async below)
  const newBoxKey = db.child('data/boxes').push().key;

  // add a reference to the new box in the project record
  // projectRef
  //   .child('boxes')
  //   .child(newBoxKey)
  //   .set(true);

  // this is nested within addBox since you'd never call it without adding the box to the project as well
  // const addBoxObject = (newBox) => {
  //   db
  //     .child('data/boxes')
  //     .child(newBoxKey)
  //     .set(newBox);
  //   db
  //     .child('data/boxes')
  //     .child(newBoxKey)
  //     .child('projects')
  //     .child(projectId)
  //     .set(true);
  // };


  box.projectKey = currentProjectKey;

  const newData = {
    [`user/${uid}/boxKeys/${newBoxKey}`]: true,
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

  // db
  //   .child('data/boxes')
  //   .child(newBoxKey)
  //   .set(newBox);
  // db
  //   .child('data/boxes')
  //   .child(newBoxKey)
  //   .child('projects')
  //   .child(projectId)
  //   .set(true);

  // if (box.label) {
  //   addBoxObject(box);
  // } else {
  //   // look up the project to get the last boxLabelId so we can give this new box a sequential label
  //   projectRef
  //     .once('value')
  //     .then(projectSnapshot => {
  //       let lastBoxLabelId = (projectSnapshot.val().lastBoxLabelId || 0) + 1;
  //
  //       // update the boxLabelId counter in the project
  //       projectRef.update({lastBoxLabelId: lastBoxLabelId});
  //
  //       // add the next box with the label based on lastBoxLabelId
  //       addBoxObject({
  //         ...box,
  //         label: `label${lastBoxLabelId}`,
  //       });
  //     });
  // }

  return newBoxKey;
}

export function updateBox({boxId, newProps}) {
  db
    .child('data/boxes')
    .child(boxId)
    .update(newProps);
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

  // This module can only be used on the client
  // There is probably a better way to do this. Thinkin' about it...
  // if (typeof firebaseApp !== 'undefined') {

    // const config = {
    //   apiKey: MALLA_CONSTANTS.FIREBASE_API_KEY,
    //   authDomain: MALLA_CONSTANTS.FIREBASE_AUTH_DOMAIN,
    //   databaseURL: MALLA_CONSTANTS.FIREBASE_URL,
    //   storageBucket: MALLA_CONSTANTS.FIREBASE_STORAGE_BUCKET,
    // };
    //
    // firebaseApp.initializeApp(config);
    //
    // db = firebaseApp.database().ref();
    firebaseApp = getApp();
    db = firebaseApp.database().ref();
  // } else {
  //   console.warn('Firebase is not loaded');
  //   return;
  // }

  firebaseApp.auth().onAuthStateChanged(onAuthenticationChange);
}
