import {createStore} from 'redux';

import * as cloudStoreBindings from './cloudStoreBindings.js';
import reducers from './reducers.js';

const onClient = typeof window !== 'undefined';

const store = createStore(reducers);

if (onClient) {
  cloudStoreBindings.init(store);
}

export default store;
