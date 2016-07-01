require('babel-register');
// const firebase = require('firebase');
const argv = require('yargs').argv;

const ROLES = require('../app/constants.js').ROLES;
const firebaseAppGodMode = require('../app/server/firebaseAppGodMode.js');

// firebase.initializeApp({
//   serviceAccount: {
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//   },
//   databaseURL: process.env.FIREBASE_URL,
// });

const prodConfig = {
  serviceAccount: {
    projectId: process.env.FIREBASE_PROJECT_ID_PROD,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL_PROD,
    privateKey: process.env.FIREBASE_PRIVATE_KEY_PROD.replace(/\\n/g, '\n'),
  },
  databaseURL: process.env.FIREBASE_URL_PROD,
};

firebaseAppGodMode.init(prodConfig);
const firebaseApp = firebaseAppGodMode.getAppInGodMode();

const localFirebaseDatabase = firebaseApp.database().ref();

if (argv.func === 'addOwners') {
  console.log('  --  Running "addOwners()"  --  ');

  localFirebaseDatabase.child('users').once('value').then(userSnap => {
    const updateData = {};
    const users = userSnap.val();

    Object.keys(users).forEach(userKey => {
      const user = users[userKey];
      console.info(`> Processing ${user.name}`);

      Object.keys(user.projectKeys || {}).forEach(projectKey => {
        if (user.projectKeys[projectKey] === true) {
          console.info(`Adding ${user.name} as ${ROLES.OWNER} of project ${projectKey}`);

          updateData[`users/${userKey}/projectKeys/${projectKey}`] = ROLES.OWNER;

          updateData[`data/projects/${projectKey}/users/${userKey}`] = {
            role: ROLES.OWNER,
            name: user.name,
            email: user.email,
            profileImageURL: user.profileImageURL,
          };
        } else {
          console.info(`Project ${projectKey} is already ${user.projectKeys[projectKey]}`);
        }
      });
    });

    console.info(' - - - - - - - - - - -');
    console.info('Sending this update payload to firebase:');
    console.dir(updateData, {depth: 1, colors: true});
    localFirebaseDatabase.update(updateData);
  });
} else {
  console.info('You did not request any known function');
}
