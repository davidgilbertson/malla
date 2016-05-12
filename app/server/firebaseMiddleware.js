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

  const boxes = {};
  let totalBoxCount = 0;
  let fetchedBoxCount = 0;

  const projectBoxesRef = db
    .child('data/projects')
    .child(projectId)
    .child('boxes'); // a list of box keys

  function getBox(boxSnapshot) {
    totalBoxCount++;

    db
      .child('data/boxes') // a list of box objects
      .child(boxSnapshot.key())
      .once('value')
      .then(boxSnapshot => {
        const box = boxSnapshot.val();
        boxes[box.label] = box.text;

        fetchedBoxCount++;

        if (fetchedBoxCount === totalBoxCount) {
          res.json(boxes);
        }
      });
  }

  projectBoxesRef.on('child_added', getBox);

  // 'value' fires after all initial 'child_added' things are done
  projectBoxesRef.once('value', () => {
    projectBoxesRef.off('child_added', getBox);
  });
}
