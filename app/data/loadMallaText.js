import fs from 'fs';
import path from 'path';

let textCache;

const textFilePath = path.resolve(__dirname, 'mallaText.json');

function fetchMallaText() {
  return fetch('http://www.malla.io/api/-KIu8pHPr8i9oyLh56Ok.json')
    .then(response => response.json())
    .then(data => {
      textCache = data;

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

  return Promise.resolve(textCache);
}
