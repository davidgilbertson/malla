import {createStore} from 'redux';

import * as firebaseActions from './firebaseActions.js';
import firebaseWatcher from './firebaseWatcher.js';
import reducers from './reducers';
import {
  ls,
} from '../utils';
import {
  LS_WRITE_DELAY,
} from '../constants.js';

const onClient = typeof window !== 'undefined';

let localState;

if (onClient) {
  const localStore = ls.load();

  if (localStore) {
    delete localStore.activeBox;
    delete localStore.currentTool;
    delete localStore.currentDropModal;
    delete localStore.currentModal;
    delete localStore.dataLoadStatus;
    localState = localStore;
  }
}

const store = createStore(reducers, localState);

let timer;

store.subscribe(() => {
  if (!onClient) return;

  clearTimeout(timer);

  timer = setTimeout(() => {
    ls.save(store.getState());
  }, LS_WRITE_DELAY);
});

if (onClient) {
  firebaseActions.init(store);
  firebaseWatcher.bindToStore(store);
}

export default store;
