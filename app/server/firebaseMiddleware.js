import Firebase from 'firebase';
import forOwn from 'lodash/forOwn';

var db = new Firebase(process.env.FIREBASE_URL);

db.authWithCustomToken(process.env.FIREBASE_SECRET, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('> Authenticated with firebase');
  }
});

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
