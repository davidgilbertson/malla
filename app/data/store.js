import {combineReducers, createStore} from 'redux';
import mapValues from 'lodash/mapValues';
import cloneDeep from 'lodash/cloneDeep';

import * as cloudData from './cloudData.js';
import {
  ACTIONS,
  BOX_MODES,
  MODALS,
} from '../constants.js';

const defaultScreen = {
  id: 1,
  width: 1366,
  height: 768,
};

const screens = (state = [defaultScreen], action) => {
  switch (action.type) {
    case ACTIONS.ADD_SCREEN :
      return [...state, action.screen];

    case ACTIONS.DELETE_SCREEN :
      return state.filter(screen => screen.id !== action.id);

    default:
      return state;
  }
};

const activeBox = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.SET_ACTIVE_BOX :
      if (!action.id) {
        return {};
      }

      return {
        id: action.id,
        mode: action.mode,
      };
    default :
      return state;
  }
};

const modal = (state = MODALS.NONE, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_MODAL :
      if (!MODALS[action.modal]) {
        console.warn(action.modal, 'is not a recognised modal name')
        return MODALS.NONE;
      }

      return action.modal;
    default :
      return MODALS.NONE;
  }
};

const boxes = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.SET_BOXES :
      return action.boxes;

    case ACTIONS.ADD_OR_UPDATE_BOX :
      return {...state, ...action.box};

    case ACTIONS.UPDATE_BOX :
      return mapValues(state, (box, id) => {
        if (id === action.id) {
          return {...box, ...action.newProps};
        }

        return {...box};
      });

    case ACTIONS.DELETE_BOX :
      const newState = cloneDeep(state);
      delete newState[action.id];
      return newState;

    case ACTIONS.SET_BOX_MODE :
      return mapValues(state, (box, id) => {
        if (id === action.id) {
          return {...box, mode: action.mode};
        }

        return {...box, mode: BOX_MODES.SITTING};
      });

    default:
      return state;
  }
};

const reducers = combineReducers({
  activeBox,
  boxes,
  modal,
  screens,
});

const onClient = typeof window !== 'undefined';

const store = createStore(reducers);

if (onClient) {
  cloudData.bindStoreToCloud(store);
}

export default store;
