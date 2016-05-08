import {combineReducers, createStore} from 'redux';

import * as cloudData from './cloudData.js';
import * as reducers from './reducers.js';

const combinedReducers = combineReducers(reducers);

const onClient = typeof window !== 'undefined';

const store = createStore(combinedReducers);

if (onClient) {
  cloudData.bindStoreToCloudForUser(store);
}

export default store;
