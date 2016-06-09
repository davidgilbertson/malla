import {createStore} from 'redux';

import * as firebaseActions from './firebaseActions.js';
import firebaseWatcher from './firebaseWatcher.js';
import reducers from './reducers';
import {
  ls,
} from '../utils';
import {
  ACTIONS,
} from '../constants.js';

const onClient = typeof window !== 'undefined';

function makeGlobalReducer(reducer) {
  return function(state, action) {
    switch (action.type) {
      case ACTIONS.REPLACE_STATE:
        return action.state;

      default:
        return reducer(state, action);
    }
  }
}

const globalReducer = makeGlobalReducer(reducers);

const store = createStore(globalReducer);

function populateFromLocalStorage(store) {
  const localState = ls.load();

  // next tick, just to avoid the react warning that markup is
  // different on client and server. Probably a bad idea
  setTimeout(() => {
    if (localState) {
      store.dispatch({
        type: ACTIONS.REPLACE_STATE,
        state: ls.load(),
      });
    }
  });
}

let timer;

store.subscribe(() => {
  if (!onClient) return;

  clearTimeout(timer);

  timer = setTimeout(() => {
    ls.save(store.getState());
  }, 500);
});

if (onClient) {
  populateFromLocalStorage(store);
  firebaseActions.init(store);
  firebaseWatcher.bindToStore(store);
}

export default store;
