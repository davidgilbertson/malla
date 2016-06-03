import fs from 'fs';
import path from 'path';

let textCache;

const textFilePath = path.resolve(__dirname, 'mallaText.json');

function parseResponse(raw) {
  return {
    title: raw.title,
    siteName: raw.title,
    slogan: raw.slogan,
    box1Title: raw.box1Title,
    box1Desc: raw.box1Desc,
    box2Title: raw.box2Title,
    box2Desc: raw.box2Desc,
    box3Title: raw.box3Title,
    box3Desc: raw.box3Desc,
    signUpLong: raw.signUpLong,
    question1: raw.question1,
    answer1: raw.answer1,
    question2: raw.question2,
    answer2: raw.answer2,
    question3: raw.question3,
    answer3: raw.answer3,
    signIn: raw.signIn,
    signUp: raw.signUp,
    signOut: raw.signOut,
    apiButtonShort: raw.apiButtonShort,
    apiButtonLong: raw.apiButtonLong,
    help: raw.help,
    shareFacebookTooltip: raw.shareFacebookTooltip,
    shareTwitterTooltip: raw.shareTwitterTooltip,
    shareLinkedInTooltip: raw.shareLinkedInTooltip,
    feedbackTooltip: raw.feedbackTooltip,
    betaDisclaimer: raw.betaDisclaimer,
  }
}

function fetchMallaText() {
  return fetch('http://www.malla.io/api/-KIu8pHPr8i9oyLh56Ok.json')
    .then(response => response.json())
    .then(data => {
      textCache = parseResponse(data);

      fs.writeFile(textFilePath, JSON.stringify(textCache, null, 2), 'utf8');

      return Promise.resolve(textCache);
    })
    .catch(err => {
      console.warn(`Error fetching Malla text: ${err}`);
    });
}

// kick off when the server starts
// and check every now and then
export function startListening() {
  fetchMallaText();

  setInterval(() => {
    fetchMallaText();
  }, 1000);
}

// as soon as text has been fetched once, it will be in textCache
// this returns a promise on the off change the first fetch isn't back
export function getText() {
  // if the fetch hasn't worked, use the local text file
  if (!textCache) {
    console.warn(`There was no cache for text. Loading from ${textFilePath}`);
    const text = fs.readFileSync(textFilePath, 'utf8');
    return Promise.resolve(JSON.parse(text));
  }
  
  return fetchMallaText();
}
