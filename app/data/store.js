import {combineReducers, createStore} from 'redux';

import {ACTIONS} from '../constants';

const defaultScreen = {
  id: 1,
  width: 1366,
  height: 768,
};

const screens = (state = [defaultScreen], action) => {
  switch (action.type) {
    case ACTIONS.ADD_SCREEN :
      return [
        ...state,
        action.screen,
      ];
    case ACTIONS.DELETE_SCREEN :
      return state.filter(screen => screen.id !== action.id);
    default:
      return state;
  }
};

const boxes = (state = [], action) => {
  switch (action.type) {
    case ACTIONS.ADD_BOX :
      return [
        ...state,
        action.box,
      ];
    case ACTIONS.SELECT_BOX :
      return state.map(box => {
        if (box.id === action.id) {
          return {
            ...box,
            selected: true,
          }
        }

        return {
          ...box,
          selected: false,
        }
      });
    case ACTIONS.DELETE_BOX :
      return state.filter(box => box.id !== action.id);
    default:
      return state;
  }
};

const reducers = combineReducers({screens, boxes});

let initialState;

const onClient = typeof window !== 'undefined';

if (onClient) {
  initialState = window.MALLA_STATE || {};
}

const store = createStore(reducers, initialState);

// testing
if (onClient) window.MALLA_STORE = store;

export default store;
