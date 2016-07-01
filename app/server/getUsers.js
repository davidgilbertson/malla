import {getAppInGodMode} from './firebaseAppGodMode.js';

import {
  fuzzySearch,
  getPublicUserProps,
  makeArray,
} from '../utils';

const usersRef = getAppInGodMode().database().ref('users');

let usersCache;

function cacheUsersFromFirebase() {
  usersRef.once('value').then(snap => {
    if (snap.val()) {
      if (!usersCache) {
        console.info('User cache loaded');
      }

      usersCache = makeArray(snap.val())
        .map(user => ({
          _key: user._key,
          ...getPublicUserProps(user),
        }));
    }
  });
}

cacheUsersFromFirebase(); // prime the cache as soon as the server starts

setInterval(cacheUsersFromFirebase, 10000); // then every 10 seconds

export default function(req, res) {
  res.set({'Cache-Control': 'no-cache, no-store, must-revalidate'}); // for MS

  if (!usersCache) {
    res.json([]);
    return;
  }

  const searchStr = req.query.q;
  let users = usersCache;

  if (searchStr) {
    users = fuzzySearch({searchStr, arr: usersCache, prop: 'name'});
  }

  res.json(users);
}
