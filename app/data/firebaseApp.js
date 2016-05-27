import firebase from 'firebase';

let firebaseApp;

export function init() {
  firebase.initializeApp({
    apiKey: MALLA_CONSTANTS.FIREBASE_API_KEY,
    authDomain: MALLA_CONSTANTS.FIREBASE_AUTH_DOMAIN,
    databaseURL: MALLA_CONSTANTS.FIREBASE_URL,
    storageBucket: MALLA_CONSTANTS.FIREBASE_STORAGE_BUCKET,
  });
  
  firebaseApp = firebase;
  
  return firebaseApp;
}
  
export function getApp() {
  return firebaseApp || init();
}
