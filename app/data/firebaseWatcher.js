import {
  ACTIONS,
  DATA_LOAD_STATUSES,
  LS_WRITE_DELAY,
  ROLES,
} from '../constants.js';

import {
  ls,
} from '../utils';

import {getApp} from './firebaseApp.js';
import * as firebaseActions from './firebaseActions.js';
import * as actions from './actions.js';

let isSignedIn = false;
let uid;
const cache = {};
let store;
let statusTimer;

const TYPES = {
  PROJECT: {
    dbPath: 'data/projects',
    actions: {
      upsert: project => store.dispatch({type: ACTIONS.UPSERT_PROJECT, ...project}),
      remove: key => store.dispatch({type: ACTIONS.REMOVE_PROJECT, key}),
    },
  },
  SCREEN: {
    dbPath: 'data/screens',
    actions: {
      upsert: screen => store.dispatch({type: ACTIONS.UPSERT_SCREEN, ...screen}),
      remove: key => store.dispatch({type: ACTIONS.REMOVE_SCREEN, key}),
    },
  },
  BOX: {
    dbPath: 'data/boxes',
    actions: {
      upsert: box => store.dispatch({type: ACTIONS.UPSERT_BOX, ...box}),
      remove: key => store.dispatch({type: ACTIONS.REMOVE_BOX, key}),
    },
  },
};

const loadStatusWatcher = {
  isWaiting: true,
  lastTime: Infinity,
  wait(wait = 1000) { // keep an eye on this. I haven't seen anything more than 300ms
    if (!this.isWaiting) return;

    if (+new Date() - this.lastTime > 400) {
      console.warn(`there was a ${+new Date() - this.lastTime}ms gap between objects loading`);
    }

    this.lastTime = +new Date();
    if (statusTimer) clearTimeout(statusTimer);

    statusTimer = setTimeout(() => {
      this.isWaiting = false;
      store.dispatch({
        type: ACTIONS.SET_DATA_LOAD_STATUS,
        dataLoadStatus: DATA_LOAD_STATUSES.COMPLETE,
      });
    }, wait);
  },
};

class Watcher {
  constructor(snapshot, type) {
    this.captureChanges = true;
    this.type = type;
    this.key = snapshot.key;
    this.ref = this.type.dbRef.child(this.key);
    this.ref.on('value', this.onChange.bind(this));
  }

  onChange(snapshot) {
    this.snapshot = snapshot;
    if (!this.captureChanges || !snapshot) return;

    if (this.type === TYPES.PROJECT) {
      let role = ROLES.OWNER; // assume that since they're seeing the project, they're the owner

      if (snapshot.val() && snapshot.val().users && snapshot.val().users[uid]) {
        role = snapshot.val().users[uid].role;
      }

      if (role === ROLES.NO_ACCESS) {
        this.remove();
        return;
      }
    }

    this.type.actions.upsert({
      key: this.key,
      val: snapshot.val(),
    });
  }

  remove() {
    // the key can be removed and the item updated at the same time
    // e.g. when a project is removed from a user. The key goes from the user record
    // then the project is updated to not show the user. We don't want to capture that change
    // because that's an upsert that just adds the project again for the user
    // we remove the listener here but the onChange event is already in the event queue
    // so we just instruct it to ignore any future changes
    this.captureChanges = false;

    if (this.type === TYPES.PROJECT) { // a data/projects project is being removed
      const project = this.snapshot ? this.snapshot.val() : {};

      Object.keys(project.screenKeys || {}).forEach(screenKey => {
        cache[screenKey].remove();
        delete cache[screenKey];
      });

      Object.keys(project.boxKeys || {}).forEach(boxKey => {
        cache[boxKey].remove();
        delete cache[boxKey];
      });
    }
    this.type.actions.remove(this.key);
    this.ref.off('value', this.onChange);
  }
}

class FirebaseWatcher {
  constructor(db) {
    this.db = db;
  }

  watchList(ref, type) {
    ref.on('child_added', snap => this.onChildAdded(snap, type));
    ref.on('child_removed', snap => this.onChildRemoved(snap, type));
  }

  onChildAdded(snapshot, type) {
    loadStatusWatcher.wait();

    if (type === TYPES.PROJECT) { // a users/$uid/projectKeys is being added
      // if It's true, I'm allowed to see it
      // if it's 'NO_ACCESS' it means I've been revoked
      // make sure that project is removed from the localStorage
      // and that no listeners are added
      // This is a bit dodgy. All I know about this project is that I no longer have access.
      // I don't know what screens and boxes were in the project, so they remain in LS.
      // So the rest of the app needs to check for the existence of the 'current' project
      // before anything else (I'm looking at you, Screen.jsx)
      if (snapshot.val() === ROLES.NO_ACCESS) {
        type.actions.remove(snapshot.key); // removing a project that was loaded from localStorage, but access has been revoked
        return;
      }

      const projectRef = this.db.child('data/projects').child(snapshot.key);

      this.watchList(projectRef.child('screenKeys'), TYPES.SCREEN);
      this.watchList(projectRef.child('boxKeys'), TYPES.BOX);
    }

    cache[snapshot.key] = new Watcher(snapshot, type);
  }

  onChildRemoved(snapshot) {
    cache[snapshot.key].remove();
    delete cache[snapshot.key];
  }
}


function onUserChange(userDataSnapshot) {
  if (userDataSnapshot.val()) {
    actions.signInUser({
      key: userDataSnapshot.key,
      val: userDataSnapshot.val(),
    });
  }
}

function startListening(providerUser) {
  loadStatusWatcher.wait();

  const db = getApp().database().ref();
  const firebaseWatcher = new FirebaseWatcher(db);
  const userRef = db.child('users').child(providerUser.uid);

  TYPES.PROJECT.dbRef = db.child(TYPES.PROJECT.dbPath);
  TYPES.SCREEN.dbRef = db.child(TYPES.SCREEN.dbPath);
  TYPES.BOX.dbRef = db.child(TYPES.BOX.dbPath);

  userRef.on('value', onUserChange);
  firebaseWatcher.watchList(userRef.child('projectKeys'), TYPES.PROJECT, db);
}

export default {
  bindToStore: (reduxStore) => {
    store = reduxStore;

    getApp().auth().onAuthStateChanged(providerUser => {
      if (providerUser && !isSignedIn) { // user has just signed in
        isSignedIn = true;
        uid = providerUser.uid; // used when checking if the user can see the project
        firebaseActions.handleSignIn(providerUser).then(startListening);
      }

      if (isSignedIn && !providerUser) { // user is signing out
        isSignedIn = false;
        uid = null; // TODO (davidg): this and isSignedIn could be the one thing
        store.dispatch({
          type: ACTIONS.SIGN_OUT,
        });

        setTimeout(() => {
          ls.empty(); // must be called after anything that would change the store
        }, LS_WRITE_DELAY + 50);
      }
    });
  },
};
