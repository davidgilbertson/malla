import {
  ROLES,
} from '../constants.js';

import {makeArray} from './makeArray.js';

export function userOwnsProject(user = {}, project = {}) {
  const ownerRecord = makeArray(project.users).find(projectUser => {
    const isThisUser = projectUser._key === user.uid;
    const userHasAccess = projectUser.role === ROLES.OWNER;

    return isThisUser && userHasAccess;
  });

  return !!ownerRecord;
}
