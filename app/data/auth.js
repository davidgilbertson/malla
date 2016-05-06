import * as cloudData from './cloudData.js';

const mockSite = {
  name: 'My first site',
  description: 'A site to get you started',
};

// TODO (davidg): better boxes
const mockBox1 = {
  top: 10,
  left: 10,
  width: 100,
  height: 50,
  text: 'Your site title goes here',
  label: 'title',
};

const mockBox2 = {
  top: 100,
  left: 10,
  width: 100,
  height: 50,
  text: 'Some more text goes here. Click a text box once to move/resize, click again to edit the text.',
  label: 'desc',
};

export function signOut() {
  const db = cloudData.getDb();
  db.unauth();
}

export function createUser(authData) {
  const db = cloudData.getDb();

  // add the user
  db.child(`users/${authData.uid}`).set({
    name: authData.google.displayName,
    provider: 'google',
    google: authData.google,
  });

  // get a reference to what will be the new site (note the empty push())
  const newSiteRef = db.child('data/sites').push();

  // add a reference to that site in the user's list of sites
  db.child(`users/${authData.uid}/sites/${newSiteRef.key()}`).set(true);

  // add the actual site (since it now exists in the user's list of sites)
  db.child(`data/sites/${newSiteRef.key()}`).set({
    ...mockSite,
    owner: authData.uid,
  });

  // add some boxes
  const box1Ref = db.child('data/boxes').push(mockBox1);
  const box2Ref = db.child('data/boxes').push(mockBox2);

  // reference those boxes from the site
  db.child(`data/sites/${newSiteRef.key()}/boxes/${box1Ref.key()}`).set(true);
  db.child(`data/sites/${newSiteRef.key()}/boxes/${box2Ref.key()}`).set(true);

  console.log(`We're done!! Now you could in theory go do some work.`);
}

export function signIn(provider = 'google') {
  if (provider !== 'google') {
    console.warn(`The provider '${provider}' is not supported`);
    return;
  }

  const db = cloudData.getDb();
  db.authWithOAuthPopup(provider).then(authData => {
    db.child(`users/${authData.uid}`).once('value', dataSnapshot => {
      if (!dataSnapshot.val()) {
        createUser(authData);
      }
    });
  }).catch(err => {
    console.warn('Error signing in.', err);
  });
}
