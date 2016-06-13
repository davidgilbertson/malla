import {createStore} from 'redux';

import * as firebaseActions from './firebaseActions.js';
import firebaseWatcher from './firebaseWatcher.js';
import reducers from './reducers';
import {
  ls,
} from '../utils';

const onClient = typeof window !== 'undefined';

let localState;

if (onClient) {
  const localStore = ls.load();

  if (localStore) localState = localStore;
}

const store = createStore(reducers, localState);

let timer;

store.subscribe(() => {
  if (!onClient) return;

  clearTimeout(timer);

  timer = setTimeout(() => {
    ls.save(store.getState());
  }, 500);
});

if (onClient) {
  firebaseActions.init(store);
  firebaseWatcher.bindToStore(store);
}

export default store;
