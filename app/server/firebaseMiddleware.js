import firebase from 'firebase';
import forOwn from 'lodash/forOwn';

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

  db
    .child('data/boxes')
    .orderByChild(`projects/${projectId}`)
    .equalTo(true)
    .once('value', boxSnapshot => {
      const json = {};

      forOwn(boxSnapshot.val(), box => {
        json[box.label] = box.text;
      });

      res.header('Access-Control-Allow-Origin', '*');
      res.json(json);
    });
}
