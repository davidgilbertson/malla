import firebase from 'firebase';

import {
  getBoxJson,
} from '../utils';

import {
  API_TEXT_FORMATS,
} from '../constants.js';

const config = {
  serviceAccount: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  databaseURL: process.env.FIREBASE_URL,
};

firebase.initializeApp(config);

const db = firebase.database().ref();

export default function(req, res) {
  const projectId = req.params.projectId;
  const format = req.query.format || API_TEXT_FORMATS.HTML;

  db
    .child('data/boxes')
    .orderByChild(`projectKey`)
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
