import {combineReducers} from 'redux';
import mapValues from 'lodash/mapValues';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

import {
  ACTIONS,
  MODALS,
  SIGN_IN_STATUSES,
  TOOLS,
  TOOLTIPS,
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

const currentTool = (state = TOOLS.TEXT, action) => {
  switch (action.type) {
    case ACTIONS.SELECT_TOOL :
      return action.tool;
    
    default :
      return state;
  }
};

const currentTooltip = (state = TOOLTIPS.NONE, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_TOOLTIP :
      if (!action.tooltip) {
        return TOOLTIPS.NONE;
      }
      return action.tooltip;
    
    default :
      return TOOLTIPS.NONE;
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

function upsert(state, action) {
  let nextState = {};

  merge(nextState, state, {[action.key]: action.val});

  return nextState;
}

const projects = (state = {}, action) => {
  switch (action.type) {

    case ACTIONS.UPSERT_PROJECT :
      return upsert(state, action);

    case ACTIONS.SIGN_OUT :
      return {};

    default:
      return state;
  }
};

const screens = (state = {}, action) => {
  switch (action.type) {

    case ACTIONS.UPSERT_SCREEN :
      return upsert(state, action);

    case ACTIONS.SIGN_OUT :
      return {};

    default:
      return state;
  }
};

const boxes = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.UPSERT_BOX :
      return upsert(state, action);

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
  currentTool,
  interaction,
  currentTooltip,
  modal,
  boxes,
  screens,
  projects,
  user,
});
