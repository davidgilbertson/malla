import slug from 'speakingurl';

import {
  ACTIONS,
} from '../constants.js';

let db;
let currentProjectId;
let reduxStore;
let isSignedIn = false;

/*  --  USERS  --  */
function onUserChange(userDataSnapshot) {
  if (userDataSnapshot.val()) {
    reduxStore.dispatch({
      type: ACTIONS.SIGN_IN_USER, // TODO (davidg): .UPDATE_USER ?
      user: {
        id: userDataSnapshot.key,
        ...userDataSnapshot.val(),
      },
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

    db
      .child('users')
      .child(user.uid)
      .child('projects')
      .on('child_added', onProjectKeyAdded);
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
      provider = new firebase.auth.FacebookAuthProvider();
      break;
    case 'google':
      provider = new firebase.auth.GoogleAuthProvider();
      break;
    case 'twitter':
      provider = new firebase.auth.TwitterAuthProvider();
      break;
    default:
      console.warn(`The providerString '${providerString}' is not supported`);
      return Promise.reject(`The providerString '${providerString}' is not supported`);
  }

  return firebase.auth().signInWithPopup(provider); // TODO (davidg): on error sign in with redirect
}

export function addUser({userId, user}) {
  db
    .child('users')
    .child(userId)
    .set(user);
}

export function updateUser({userId, newProps}) {
  db
    .child('users')
    .child(userId)
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
  firebase.auth().signOut();
}


/*  --  PROJECTS  --  */
// TODO (davidg): store this in the reduxStore.
export function getCurrentProject(userId) {
  return currentProjectId;
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
    project: {
      [projectSnapshot.key]: projectSnapshot.val(),
    },
  });
}

export function setCurrentProject(projectId) {
  // this should only be called as a result of a route change

  // by looking for the projectId and returning the promise,
  // we can catch a project-not-found error in the calling function and behave appropriately
  return db
    .child('data/projects')
    .child(projectId)
    .once('value')
    .then(() => {
      // this never fires if projectId doesn't exist or permission denied
      if (currentProjectId && currentProjectId !== projectId) {
        // stop listening for box changes on a previous project
        db.child(`data/projects/${currentProjectId}/boxes`).off('child_added', onBoxKeyAdded);
        db.child(`data/projects/${currentProjectId}/boxes`).off('child_removed', onBoxKeyRemoved);
      }

      currentProjectId = projectId;

      db.child(`data/projects/${projectId}/boxes`).on('child_added', onBoxKeyAdded);
      db.child(`data/projects/${projectId}/boxes`).on('child_removed', onBoxKeyRemoved);
    });
}

export function getMruProject(userId) {
  return db
    .child('users')
    .child(userId)
    .child('mruProject')
    .once('value')
    .then(snapshot => {
      return db
        .child('data/projects')
        .child(snapshot.val())
        .once('value')
        .then(snapshot => Promise.resolve({
          id: snapshot.key,
          ...snapshot.val(),
        }));
    });
}

export function addProject({userId, project}) {
  // get a reference to what will be the new project (note the empty push())
  const newProjectRef = db.child('data/projects').push();

  // add a reference to that project in the user's list of projects
  db
    .child('users')
    .child(userId)
    .child('projects')
    .child(newProjectRef.key)
    .set(true);

  // set that as the most recently used project
  db
    .child('users')
    .child(userId)
    .child('mruProject')
    .set(newProjectRef.key);

  // add the actual project (since it now exists in the user's list of projects)
  db
    .child('data/projects')
    .child(newProjectRef.key)
    .set({
      ...project,
      lastBoxLabelId: 1,
      slug: slug(project.name),
      owner: userId,
    });

  return newProjectRef.key;
}


/*  --  BOXES  --  */
function onBoxKeyAdded(boxSnapshot) {
  db
    .child('data/boxes')
    .child(boxSnapshot.key)
    .on('value', onBoxChanged);
}

function onBoxKeyRemoved(boxSnapshot) {
  reduxStore.dispatch({
    type: ACTIONS.DELETE_BOX,
    id: boxSnapshot.key,
  });
}

function onBoxChanged(boxSnapshot) {
  if (!boxSnapshot.val()) return; // when a box is first pushed as a ref it is null

  reduxStore.dispatch({
    type: ACTIONS.UPSERT_BOX,
    box: {
      [boxSnapshot.key]: boxSnapshot.val(),
    },
  });
}

export function addBox({box, projectId}) {
  // an odd mix of sync and async, pay attention...

  // get a ref to the project that the box belongs in
  const projectRef = db
    .child('data/projects')
    .child(projectId);

  // get a ref to the new box to return the ID immediately (the actual box gets created async below)
  const newBoxRef = db.child('data/boxes').push();
  const newBoxId = newBoxRef.key;

  // add a reference to the new box in the project record
  projectRef
    .child('boxes')
    .child(newBoxId)
    .set(true);

  // this is nested within addBox since you'd never call it without adding the box to the project as well
  const addBoxObject = (newBox) => {
    db
      .child('data/boxes')
      .child(newBoxId)
      .set(newBox);
    db
      .child('data/boxes')
      .child(newBoxId)
      .child('projects')
      .child(projectId)
      .set(true);
  };

  if (box.label) {
    addBoxObject(box);
  } else {
    // look up the project to get the last boxLabelId so we can give this new box a sequential label
    projectRef
      .once('value')
      .then(projectSnapshot => {
        let lastBoxLabelId = (projectSnapshot.val().lastBoxLabelId || 0) + 1;

        // update the boxLabelId counter in the project
        projectRef.update({lastBoxLabelId: lastBoxLabelId});

        // add the next box with the label based on lastBoxLabelId
        addBoxObject({
          ...box,
          label: `label${lastBoxLabelId}`,
        });
      });
  }

  return newBoxId;
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
  if (typeof firebase !== 'undefined') {

    const config = {
      apiKey: MALLA_CONSTANTS.FIREBASE_API_KEY,
      authDomain: MALLA_CONSTANTS.FIREBASE_AUTH_DOMAIN,
      databaseURL: MALLA_CONSTANTS.FIREBASE_URL,
      storageBucket: MALLA_CONSTANTS.FIREBASE_STORAGE_BUCKET,
    };

    firebase.initializeApp(config);

    db = firebase.database().ref();
  } else {
    console.warn('Firebase is not loaded');
    return;
  }

  firebase.auth().onAuthStateChanged(onAuthenticationChange);
}
