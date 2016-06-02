import {combineReducers} from 'redux';
import uiReducers from './uiReducers.js';
import dataReducers from './dataReducers.js';

export default combineReducers({
  ...uiReducers,
  ...dataReducers,
});
