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

const projects = (state = {}, action) => {
  switch (action.type) {

    case ACTIONS.UPSERT_PROJECT :
      return {
        ...state,
        [action.key]: action.val,
      };

    case ACTIONS.SIGN_OUT :
      return {};

    default:
      return state;
  }
};

const screens = (state = {}, action) => {
  switch (action.type) {

    case ACTIONS.UPSERT_SCREEN :
      return {
        ...state,
        [action.key]: action.val,
      };

    case ACTIONS.SIGN_OUT :
      return {};

    default:
      return state;
  }
};

const boxes = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.UPSERT_BOX :
      console.log('  --  >  reducers.js:71 > UPSERT_BOX > action:', action);
      return {
        ...state,
        [action.key]: action.val,
      };

    case ACTIONS.UPDATE_BOX :
      return mapValues(state, (box, id) => {
        if (id === action.id) {
          return {...box, ...action.newProps};
        }

        return {...box};
      });

    case ACTIONS.REMOVE_BOX :
      const newState = cloneDeep(state);
      delete newState[action.id];
      return newState;

    case ACTIONS.CLEAR_BOXES :
    case ACTIONS.SIGN_OUT :
      return {};

    default:
      return state;
  }
};

const user = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.SIGN_IN_USER : // this gets used for updating the user as well. Probably shouldn't
      console.log('  --  >  reducers.js:109 > SIGN_IN_USER > action:', action);
      return {
        ...state,
        ...action.val,
        uid: action.key,
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

const interaction = (state = null, action) => {
  switch (action.type) {
    case ACTIONS.SET_INTERACTION:
      return action.interaction;

    default:
      return state;
  }
};

export default combineReducers({
  activeBox,
  interaction,
  modal,
  boxes,
  screens,
  projects,
  user,
});
