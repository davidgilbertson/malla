import {
  ACTIONS,
  FIREBASE_URL,
} from '../constants.js';

const onClient = typeof window !== 'undefined';

let cloudDb;

let currentProject;

export function getDb() {
  if (!onClient) {
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

export function bindStoreToCloudForUser(store) {
  const db = getDb();
  
  if (!db) {
    console.warn('Could not initialize cloud connection');
    return;
  }

  function getDataForUser(userId) {
    // note this must also fire and clear the store when the user signs out.
    db.child(`users/${userId}/projects`).on('child_added', projectSnapshot => {
      currentProject = projectSnapshot.key();

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

  let loggedIn = false;
  // as soon as the store is bound, start listening for user events
  db.onAuth(authData => {
    if (authData && !loggedIn) { // user has signed in
      loggedIn = true;
  
      db.child(`users/${authData.uid}`).on('value', userDataSnapshot => {
        if (userDataSnapshot.val()) {
          store.dispatch({
            type: ACTIONS.SIGN_IN_OR_UPDATE_USER,
            user: userDataSnapshot.val(),
          });
        }
      });
  
      getDataForUser(authData.uid);
    }
    
    if (!authData && loggedIn) { // user is signing out
      loggedIn = false;

      store.dispatch({
        type: ACTIONS.SIGN_OUT,
      });
    }
  });
}
