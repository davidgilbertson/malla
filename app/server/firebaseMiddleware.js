import {getAppInGodMode} from './firebaseAppGodMode.js';

import {
  getBoxJson,
} from '../utils';

import {
  API_TEXT_FORMATS,
} from '../constants.js';

const db = getAppInGodMode().database().ref();

export default function(req, res) {
  const projectId = req.params.projectId;
  const format = req.query.format || API_TEXT_FORMATS.HTML;

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
