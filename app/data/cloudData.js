import {
  ACTIONS,
  FIREBASE_URL,
} from '../constants.js';

const onClient = typeof window !== 'undefined';

let cloudDb;

let currentSite;

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

export function getCurrentSite() {
  return currentSite;
}

export function bindStoreToCloud(store) {
  const db = getDb();
  if (!db) {
    console.warn('Could not initialize cloud connection');
    return;
  }

  var hasLoggedIn = false;

  function getBoxesForUser(userId) {
    db.child('users/' + userId + '/sites').once('child_added', siteSnapshot => {
      currentSite = siteSnapshot.key();

      db.child('data/sites/' + currentSite + '/boxes').on('child_added', boxSnapshot => {
        var boxId = boxSnapshot.key();

        db.child('data/boxes/' + boxId).on('value', boxSnapshot => {
          const boxId = boxSnapshot.key();
          const box = boxSnapshot.val();

          // safeguard - if a box is removed from data/boxes but not data/sites/boxes, box would be null
          if (!box) return;

          store.dispatch({
            type: ACTIONS.ADD_OR_UPDATE_BOX,
            box: {
              [boxId]: box,
            },
          });
        });
      });

      // boxes will be removed from data/boxes AND data/sites/boxes so we can just listen to data/sites/boxes
      db.child('data/sites/' + currentSite + '/boxes').on('child_removed', boxSnapshot => {
        store.dispatch({
          type: ACTIONS.DELETE_BOX,
          id: boxSnapshot.key(),
        });
      });
    });
  }

  db.onAuth(authData => {
    if (!authData || hasLoggedIn) return;
    hasLoggedIn = true;
    getBoxesForUser(authData.uid);
  });

  db.authWithPassword({
    email: 'demo@user.com',
    password: 'password',
  });
}
