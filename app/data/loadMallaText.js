import fs from 'fs';
import path from 'path';

let textCache;

const textFilePath = path.resolve(__dirname, 'mallaText.json');

function parseResponse(raw) {
  return {
    title: raw.title,
    slogan: raw.label18,
    box1Title: raw.label20,
    box1Desc: raw.label22,
    box2Title: raw.label24,
    box2Desc: raw.label26,
    box3Title: raw.label28,
    box3Desc: raw.label30,
    signUp: raw.label32,
    question1: raw.label34,
    answer1: raw.label36,
    question2: raw.label38,
    answer2: raw.label40,
    question3: raw.label42,
    answer3: raw.label44,
    signIn: raw.label46,
  }
}

function fetchMallaText() {
  return fetch('http://www.malla.io/api/-KIRExHFXrjH0sHOiN23.json')
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
