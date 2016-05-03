import {combineReducers, createStore} from 'redux';

import {
  ACTIONS,
  BOX_MODES,
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

const boxes = (state = [], action) => {
  console.log(JSON.stringify(state, null, 2));

  switch (action.type) {
    case ACTIONS.ADD_BOX :
      return [...state, action.box];

    case ACTIONS.UPDATE_BOX :
      return state.map(box => {
        if (box.id === action.id) {
          return {...box, ...action.newProps}
        }

        return {...box}
      });

    case ACTIONS.DELETE_BOX :
      return state.filter(box => box.id !== action.id);

    case ACTIONS.SELECT_BOX :
      return state.map(box => {
        if (box.id === action.id) {
          return {...box, selected: true}
        }

        return {...box, selected: false}
      });

    case ACTIONS.SET_BOX_MODE :
      return state.map(box => {
        if (box.id === action.id) {
          return {...box, mode: action.mode}
        }

        return {...box, mode: BOX_MODES.SITTING}
      });

    default:
      return state;
  }
};

const reducers = combineReducers({screens, boxes});

let initialState;

const onClient = typeof window !== 'undefined';

if (onClient) {
  initialState = window.MALLA_STATE || {};
} else {
  initialState = {
    boxes: require('./mockData.json'),
  };
}

export default createStore(reducers, initialState);
