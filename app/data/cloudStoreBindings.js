import {browserHistory} from 'react-router';

import {
  ACTIONS,
  FIREBASE_URL,
  INTERACTIONS,
} from '../constants.js';

let cloudDb;
let currentProject;

// This module can only be used on the client
// There is probably a better way to do this. Thinkin' about it...
if (typeof Firebase !== 'undefined') {
  cloudDb = new Firebase(FIREBASE_URL);
}

// TODO (davidg): store this in the store. That's why it's called a store.
export function getCurrentProject() {
  return currentProject;
}

function getDataForUser(userId, store) {
  cloudDb.child(`users/${userId}/projects`).on('child_added', projectSnapshot => {
    currentProject = projectSnapshot.key();

    // TODO (davidg): this is not the project, it is the ID of the project in the user section
    store.dispatch({
      type: ACTIONS.ADD_PROJECT,
      project: {
        [currentProject]: projectSnapshot.val(),
      },
    });

    const interaction = store.getState().interaction;

    if (interaction === INTERACTIONS.SIGNING_IN_FROM_HOME_PAGE) {
      browserHistory.push(`/project/my-first-project/${currentProject}`);

      store.dispatch({
        type: ACTIONS.SET_INTERACTION,
        interaction: null,
      });
    }

    cloudDb.child(`data/projects/${currentProject}/boxes`).on('child_added', boxSnapshot => {
      var boxId = boxSnapshot.key();

      cloudDb.child(`data/boxes/${boxId}`).on('value', boxSnapshot => {
        const boxId = boxSnapshot.key();
        const box = boxSnapshot.val();

        // safeguard - if a box is removed from data/boxes but not data/projects/boxes, box would be null
        if (!box) return;

        store.dispatch({
          type: ACTIONS.ADD_OR_UPDATE_BOX,
          box: {
            [boxId]: box,
          },
        });
      });
    });

    // boxes will be removed from data/boxes AND data/projects/boxes so we can just listen to data/projects/boxes
    cloudDb.child(`data/projects/${currentProject}/boxes`).on('child_removed', boxSnapshot => {
      store.dispatch({
        type: ACTIONS.DELETE_BOX,
        id: boxSnapshot.key(),
      });
    });
  });
}

export function addBox({box, projectId}) {
  const newBoxRef = cloudDb.child('data/boxes').push(box);
  const newBoxId = newBoxRef.key();

  cloudDb
    .child('data/projects')
    .child(projectId)
    .child('boxes')
    .child(newBoxId)
    .set(true);

  return newBoxId;
}

export function updateBox({boxId, newProps}) {
  cloudDb
    .child('data/boxes')
    .child(boxId)
    .update(newProps);
}

export function removeBox({boxId, projectId}) {
  cloudDb
    .child('data/boxes')
    .child(boxId)
    .remove(err => {
      err && console.warn(`Error removing box from data/boxes/${boxId}:`, err);
    });

  cloudDb
    .child('data/projects')
    .child(currentProject)
    .child('boxes')
    .child(boxId)
    .remove(err => {
      err && console.warn(`Error removing box from data/projects/${projectId}/boxes/${boxId}:`, err);
    });
}

export function addProject({userId, project, boxes}) {
  // get a reference to what will be the new project (note the empty push())
  const newProjectRef = cloudDb.child('data/projects').push();

  // add a reference to that project in the user's list of projects
  cloudDb
    .child('users')
    .child(userId)
    .child('projects')
    .child(newProjectRef.key())
    .set(true);

  // add the actual project (since it now exists in the user's list of projects)
  cloudDb
    .child('data/projects')
    .child(newProjectRef.key())
    .set({
      ...project,
      owner: userId,
    });

  if (boxes) {
    // add some boxes and reference them from the project
    boxes.forEach((box, i) => {
      const boxRef = cloudDb.child('data/boxes').push(boxes[i]);
      
      cloudDb
        .child('data/projects')
        .child(newProjectRef.key())
        .child('boxes')
        .child(boxRef.key())
        .set(true);
    });
  }
}

export function signIn(provider) {
  if (!['google', 'facebook', 'twitter'].includes(provider)) {
    console.warn(`The provider '${provider}' is not supported`);
    return;
  }

  return cloudDb.authWithOAuthPopup(provider);
}

export function addUser({userId, user}) {
  cloudDb
    .child('users')
    .child(userId)
    .set(user);
}

export function checkIfUserExists(authData) {
  return cloudDb
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

export function signOut() {
  cloudDb.unauth();
}

export function bindToCloudStore(store) {
  // This only binds to the store when a user is authenticated.
  // At the very least it listens for an auth event.
  // When that (eventually) happens, the store will be populated
  
  let isSignedIn = false;
  // as soon as the store is bound, start listening for user events
  cloudDb.onAuth(authData => {
    if (authData && !isSignedIn) { // user has just signed in
      isSignedIn = true;
  
      cloudDb.child(`users/${authData.uid}`).on('value', userDataSnapshot => {
        if (userDataSnapshot.val()) {
          store.dispatch({
            type: ACTIONS.SIGN_IN_USER,
            user: userDataSnapshot.val(),
          });

        }
      });

      getDataForUser(authData.uid, store);

      //get router page, only do this if on the home page
      // browserHistory.push(`/project/todo-project-slug/${currentProject}`);
    }
    
    if (isSignedIn && !authData) { // user is signing out
      isSignedIn = false;

      store.dispatch({
        type: ACTIONS.SIGN_OUT,
      });
    }
  });
}
