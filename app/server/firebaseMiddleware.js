import Firebase from 'firebase';

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

    const boxPromises = [];

    const projectBoxesRef = db
      .child('data/projects')
      .child(projectId)
      .child('boxes'); // a list of box keys

    function getBox(boxSnapshot) {
      boxPromises.push(db
        .child('data/boxes') // a list of box objects
        .child(boxSnapshot.key())
        .once('value')
        .then(boxSnapshot => boxSnapshot.val()) // a promise that resolves with the box
      );
    }

    projectBoxesRef.on('child_added', getBox);

    // 'value' fires after all initial 'child_added' things are done
    projectBoxesRef.once('value', () => {
      projectBoxesRef.off('child_added', getBox);

      // when all promises are resolved, parse the results and respond to the client
      Promise
        .all(boxPromises)
        .then(boxes => {
          const responseJson = boxes.reduce((result, box) => {
            result[box.label] = box.text;
            return result;
          }, {});

          res.json(responseJson);
        });
    });
}
