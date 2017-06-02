import {getAppInGodMode} from './firebaseAppGodMode.js';

import {
  getBoxJson,
} from '../utils';

import {
  API_TEXT_FORMATS,
} from '../constants.js';

const db = getAppInGodMode().database().ref();

// let requestCounts = {};
// setTimeout(() => {
//   console.log('  --  >  firebaseMiddleware.js:15 > resetting requst counts ');
//   requestCounts = {};
// }, 5000);

export default function(req, res) {
  const projectId = req.params.projectId;
  const format = req.query.format || API_TEXT_FORMATS.HTML;
  const apiKey = req.query.key;

  // requestCounts[projectId] = (requestCounts[projectId] || 0) + 1;
  // TODO (davidg): make this x per hour
  // if (requestCounts[projectId] > 2) {
  //   res.json({error: 'quota exceeded. A maximum of 1 request per minute. Try again in a minute.'});
  //   return;
  // }

  console.log(`API request for ${projectId}`);

  function returnBoxes() {
    db
      .child('data/boxes')
      .orderByChild('projectKey')
      .equalTo(projectId)
      .once('value', boxSnapshot => {
        const json = getBoxJson({
          boxes: boxSnapshot.val(),
          format,
          projectKey: projectId,
        });

        res.header('Access-Control-Allow-Origin', '*');
        res.json(json);
      });
  }

  db.child('data/projects').child(projectId).once('value').then(projectSnap => {
    const project = projectSnap.val();
    let allowed = true;
    const err = {message: 'Access denied'};

    // if an api isn't required, or it is and the key matches
    if (project.requireApiKey) {
      if (!apiKey) {
        allowed = false;
        err.message += '. You must provide an API key to access this project. Check the project settings at https://www.malla.io to either get the key or allow access without a key';
      } else if (apiKey !== project.apiKey) {
        allowed = false;
        err.message += '. The API key provided does not match. You can find the correct key in the project settings at https://www.malla.io';
      }
    }

    if (allowed) {
      returnBoxes();
    } else {
      res.status(403).json(err);
    }
  });
}
