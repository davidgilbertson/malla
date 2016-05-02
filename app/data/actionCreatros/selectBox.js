import {ACTIONS} from '../../constants.js';

const selectBox = id => {
  return {
    type: ACTIONS.SELECT_BOX,
    id,
  };
};

export default selectBox;
