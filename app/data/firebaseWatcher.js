let db;
import {ACTIONS} from '../constants.js';
import {getApp} from './firebaseApp.js';

// let dispatch;

function dispatch(action) {
  console.log(action);
}

const TYPES = {
  PROJECT: {
    dbPath: 'data/projects',
    actions: {
      upsert: project => dispatch({type: ACTIONS.UPSERT_PROJECT, ...project}),
      remove: key => dispatch({type: ACTIONS.REMOVE_PROJECT, key}),
    },
  },
  SCREEN: {
    dbPath: 'data/screens',
    actions: {
      upsert: screen => dispatch({type: ACTIONS.UPSERT_SCREEN, ...screen}),
      remove: key => dispatch({type: ACTIONS.REMOVE_SCREEN, key}),
    },
  },
  BOX: {
    dbPath: 'data/boxes',
    actions: {
      upsert: box => dispatch({type: ACTIONS.UPSERT_BOX, ...box}),
      remove: key => dispatch({type: ACTIONS.REMOVE_BOX, key}),
    },
  },
};

class Watcher {
  constructor(snapshot, type) {
    this.type = type;
    this.key = snapshot.key;
    this.ref = db.child(this.type.dbPath).child(this.key);
    this.ref.on('value', this.onChange.bind(this));
  }

  onChange(snapshot) {
    if (!snapshot) return; // this fires when the object is removed. But the child_removed event handles the removal

    this.type.actions.upsert({
      key: this.key,
      val: snapshot.val(),
    });
  }

  remove() {
    this.type.actions.remove(this.key);
    this.ref.off('value', this.onChange);
  }
}

class FirebaseWatcher {
  constructor() {
    this.cache = {};
  }

  watchList(ref, type) {
    ref.on('child_added', snap => this.onChildAdded(snap, type));
    ref.on('child_removed', snap => this.onChildRemoved(snap));
  }

  onChildAdded(snapshot, type) {
    this.cache[snapshot.key] = new Watcher(snapshot, type);
  }

  onChildRemoved(snapshot) {
    this.cache[snapshot.key].remove();
    delete this.cache[snapshot.key];
  }
}

const firebaseWatcher = new FirebaseWatcher();

export default {
  bindToStore: (store) => {
    console.log('  --  >  firebaseWatcher.js:84 > bindToStore');
    // firebase.initializeApp({
    //   apiKey: MALLA_CONSTANTS.FIREBASE_API_KEY,
    //   authDomain: MALLA_CONSTANTS.FIREBASE_AUTH_DOMAIN,
    //   databaseURL: MALLA_CONSTANTS.FIREBASE_URL,
    //   storageBucket: MALLA_CONSTANTS.FIREBASE_STORAGE_BUCKET,
    // });

    const firebaseApp = getApp();

    db = firebaseApp.database().ref();

    firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        const userRef = db.child('users').child(user.uid);
        // TODO (davidg): TYPES.PROJECT.dbRef = db.child(TYPES.PROJECT.dbPath);
        // then I don't need a global 'db' in this module

        firebaseWatcher.watchList(userRef.child('projectKeys'), TYPES.PROJECT);
        firebaseWatcher.watchList(userRef.child('screenKeys'), TYPES.SCREEN);
        firebaseWatcher.watchList(userRef.child('boxKeys'), TYPES.BOX);
      }
    });

    // TODO (davidg): dispatch = store.dispatch;
  }
};
