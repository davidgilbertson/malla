import {
  ACTIONS,
  BOX_MODES,
} from '../constants.js';

let nextId = 1;

export function update(id, newProps) {
  return {
    type: ACTIONS.UPDATE_BOX,
    id,
    newProps,
  };
}

export function add(box) {
  return {
    type: ACTIONS.ADD_BOX,
    box: {
      ...box,
      text: '',
      id: `label${nextId++}`,
      mode: BOX_MODES.TYPING,
    },
  };
}

export function remove(id) {
  return {
    type: ACTIONS.DELETE_BOX,
    id,
  };
}

export function setMode(id, mode) {
  return {
    type: ACTIONS.SET_BOX_MODE,
    id,
    mode,
  };
}

export function showModal(modal) {
  return {
    type: ACTIONS.SHOW_MODAL,
    modal,
  };
}

export function hideModal() {
  return {
    type: ACTIONS.HIDE_MODAL,
  };
}
