import {ACTIONS} from '../../constants';

let nextId = 1;

const addBox = (box) => {
  return {
    type: ACTIONS.ADD_BOX,
    box: {
      ...box,
      name: `Box ${nextId}`,
      id: nextId++,
    },
  };
};

export default addBox;
