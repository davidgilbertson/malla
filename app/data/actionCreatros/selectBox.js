import {ACTIONS} from '../../constants';

const selectBox = id => {
  return {
    type: ACTIONS.SELECT_BOX,
    id,
  };
};

export default selectBox;
