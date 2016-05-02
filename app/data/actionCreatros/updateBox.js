import {ACTIONS} from '../../constants.js';

const updateBox = (id, newProps) => {
  return {
    type: ACTIONS.UPDATE_BOX,
    id,
    newProps,
  };
};

export default updateBox;
