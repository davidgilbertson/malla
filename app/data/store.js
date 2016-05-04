import {combineReducers, createStore} from 'redux';
import forOwn from 'lodash/forOwn';
import mapValues from 'lodash/mapValues';
import cloneDeep from 'lodash/cloneDeep';

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
    case ACTIONS.ADD_BOX :
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
  boxes,
  modal,
  screens,
});

let initialState;

const onClient = typeof window !== 'undefined';

if (onClient) {
  initialState = window.MALLA_STATE || {};
} else {
  const mockData = require('./mockData.json');

  initialState = {
    boxes: mockData[0].data.boxes, // we get errors if mockData isn't an array
  };
}

export default createStore(reducers, initialState);
