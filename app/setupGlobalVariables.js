global.fetch = require('isomorphic-fetch');

global.MALLA_CONSTANTS = {
  APP_VERSION: 8,
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_URL: process.env.FIREBASE_URL,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
};
