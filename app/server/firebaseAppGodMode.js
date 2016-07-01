import firebase from 'firebase';

let firebaseApp;

const defaultConfig = {
  serviceAccount: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  databaseURL: process.env.FIREBASE_URL,
};

// you can pass a custom config (e.g. prod) by calling init() explicitly
export function init(config = defaultConfig) {
  firebase.initializeApp(config);

  firebaseApp = firebase;

  return firebaseApp;
}

export function getAppInGodMode() {
  if (typeof window !== 'undefined') {
    console.error('Something has gone wrong, this should not be used in the browser');
  }

  return firebaseApp || init();
}
