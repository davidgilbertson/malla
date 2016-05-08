import {combineReducers} from 'redux';
import mapValues from 'lodash/mapValues';
import cloneDeep from 'lodash/cloneDeep';

import {
  ACTIONS,
  MODALS,
  SIGN_IN_STATUSES,
} from '../constants.js';

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

    case ACTIONS.SIGN_OUT :
      return {};

    default:
      return state;
  }
};

const user = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.SIGN_IN_OR_UPDATE_USER :
      return {
        ...state,
        ...action.user,
        signInStatus: SIGN_IN_STATUSES.SIGNED_IN
      };

    case ACTIONS.SIGN_OUT :
      return {
        ...state,
        signInStatus: SIGN_IN_STATUSES.SIGNED_OUT
      };

    default:
      return state;
  }
};

export default combineReducers({
  activeBox,
  modal,
  boxes,
  user,
});
