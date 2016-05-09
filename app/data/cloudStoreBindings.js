import {browserHistory} from 'react-router';

import {
  ACTIONS,
  FIREBASE_URL,
  INTERACTIONS,
} from '../constants.js';

let cloudDb;
let currentProject;

export function getDb() {
  if (typeof window === 'undefined') {
    console.warn(`Can't get reference to db on the server`);
    return null;
  } else if (typeof Firebase === 'undefined') {
    console.warn('Firebase has not been loaded');
    return null;
  } else {
    if (cloudDb) {
      return cloudDb;
    } else {
      cloudDb = new Firebase(FIREBASE_URL);
      return cloudDb;
    }
  }
}

export function getCurrentProject() {
  return currentProject;
}

function getDataForUser(userId, store) {
  const db = getDb();
  
  db.child(`users/${userId}/projects`).on('child_added', projectSnapshot => {
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

    db.child(`data/projects/${currentProject}/boxes`).on('child_added', boxSnapshot => {
      var boxId = boxSnapshot.key();

      db.child(`data/boxes/${boxId}`).on('value', boxSnapshot => {
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
    db.child(`data/projects/${currentProject}/boxes`).on('child_removed', boxSnapshot => {
      store.dispatch({
        type: ACTIONS.DELETE_BOX,
        id: boxSnapshot.key(),
      });
    });
  });
}

export function bindToCloudStore(store) {
  // This only binds to the store when a user is authenticated.
  // At the very least it listens for an auth event.
  // When that (eventually) happens, the store will be populated
  const db = getDb();
  
  let isSignedIn = false;
  // as soon as the store is bound, start listening for user events
  db.onAuth(authData => {
    if (authData && !isSignedIn) { // user has just signed in
      isSignedIn = true;
  
      db.child(`users/${authData.uid}`).on('value', userDataSnapshot => {
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
