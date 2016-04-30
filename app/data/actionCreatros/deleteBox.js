import {ACTIONS} from '../../constants';

const deleteBox = (id) => {
  return {
    type: ACTIONS.DELETE_BOX,
    id,
  };
};

export default deleteBox;
