import {ACTIONS} from '../constants.js';

let nextId = 1;

export function update(id, newProps) {
  return {
    type: ACTIONS.UPDATE_BOX,
    id,
    newProps,
  };
}

export function select(id) {
  return {
    type: ACTIONS.SELECT_BOX,
    id,
  };
}

export function add(box) {
  return {
    type: ACTIONS.ADD_BOX,
    box: {
      ...box,
      name: `Box ${nextId}`,
      id: nextId++,
    },
  };
}

export function remove(id) {
  return {
    type: ACTIONS.DELETE_BOX,
    id,
  };
}
