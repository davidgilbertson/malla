import {createStore} from 'redux';

import * as firebaseActions from './firebaseActions.js';
import firebaseWatcher from './firebaseWatcher.js';
import reducers from './reducers';

const onClient = typeof window !== 'undefined';

const store = createStore(reducers);

if (onClient) {
  firebaseActions.init(store);
  firebaseWatcher.bindToStore(store);
}

export default store;
