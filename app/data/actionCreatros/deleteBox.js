import {ACTIONS} from '../../constants.js';

const deleteBox = id => {
  return {
    type: ACTIONS.DELETE_BOX,
    id,
  };
};

export default deleteBox;
