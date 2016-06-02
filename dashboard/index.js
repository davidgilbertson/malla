const express = require('express');
const firebase = require('firebase');
const app = express();

const config = {
  serviceAccount: {
    projectId: process.env.FIREBASE_PROJECT_ID_PROD,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL_PROD,
    privateKey: process.env.FIREBASE_PRIVATE_KEY_PROD.replace(/\\n/g, '\n'),
  },
  databaseURL: process.env.FIREBASE_URL_PROD,
};

firebase.initializeApp(config);
const ref = firebase.database().ref();

app.use(express.static('dashboard'));

app.get('/users', (req, res) => {
  return ref.child('users').once('value', usersSnap => {
    const userList = usersSnap.val();
    const userKeys = Object.keys(userList);

    const users = userKeys.map(key => {
      const user = userList[key];

      user.boxCount = user.boxKeys ? Object.keys(user.boxKeys).length : 0;
      user.screenCount = user.screenKeys ? Object.keys(user.screenKeys).length : 0;
      user.key = key;

      return user;
    });

    res.send(users);
  });
});

app.get('/metadata/feedback', (req, res) => {
  return ref.child('metadata/feedback').once('value', feedbackSnap => {
    const commentList = feedbackSnap.val();

    const comments = Object.keys(commentList).map(key => {
      const comments = commentList[key];

      comments.key = key;

      return comments;
    });

    res.send(comments);
  });
});

app.listen(8080, err => {
  err && console.error(err);
});
