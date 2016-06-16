import {
  ACTIONS,
  MODALS,
  TOOLS,
  DROP_MODALS,
} from '../../constants.js';

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

const currentScreenKey = (state = '', action) => {
  switch (action.type) {
    case ACTIONS.SET_CURRENT_SCREEN :
      if (!action.key) {
        return {};
      }

      return action.key;
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

const currentDropModal = (state = DROP_MODALS.NONE, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_DROP_MODAL :
      if (!action.dropModal) {
        return DROP_MODALS.NONE;
      }
      return action.dropModal;

    default :
      return DROP_MODALS.NONE;
  }
};

const currentModal = (state = MODALS.NONE, action) => {
  switch (action.type) {
    case ACTIONS.SHOW_MODAL :
      if (!MODALS[action.modal]) {
        return MODALS.NONE;
      }

      return action.modal;

    case ACTIONS.HIDE_MODAL :
      return MODALS.NONE;

    default :
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

export default {
  activeBox,
  currentTool,
  currentDropModal,
  currentModal,
  currentScreenKey,
  interaction,
};
