import * as cloudData from './cloudData.js';
import {
  ACTIONS,
} from '../constants.js';

let nextId = 1;
const onClient = typeof window !== 'undefined';

export function update(id, newProps) {
  const db = cloudData.getDb();

  db.child(`data/boxes/${id}`).update(newProps);
}

export function add(dims) {
  const currentSite = cloudData.getCurrentSite();
  const db = cloudData.getDb();

  const box = {
    ...dims,
    text: '',
  };

  const newBoxRef = db.child('data/boxes').push(box);

  const newBoxId = newBoxRef.key();

  db.child(`data/sites/${currentSite}/boxes/${newBoxId}`).set(true);

  return newBoxId;
}

export function remove(boxId) {
  const currentSite = cloudData.getCurrentSite();

  cloudData.getDb().child(`data/boxes/${boxId}`).remove(err => {
    err && console.warn(`Error removing box from data/boxes/${boxId}:`, err);
  });
  cloudData.getDb().child(`data/sites/${currentSite}/boxes/${boxId}`).remove(err => {
    err && console.warn(`Error removing box from data/sites/${currentSite}/boxes/${boxId}:`, err);
  });
}

export function setActiveBox(id, mode) {
  if (!onClient) return;

  return {
    type: ACTIONS.SET_ACTIVE_BOX,
    id,
    mode,
  };
}

export function showModal(modal) {
  return {
    type: ACTIONS.SHOW_MODAL,
    modal,
  };
}

export function hideModal() {
  return {
    type: ACTIONS.HIDE_MODAL,
  };
}
