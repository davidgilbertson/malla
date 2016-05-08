import {createStore} from 'redux';

import * as cloudData from './cloudData.js';
import reducers from './reducers.js';

const onClient = typeof window !== 'undefined';

const store = createStore(reducers);

if (onClient) {
  cloudData.bindStoreToCloudForUser(store);
}

export default store;
