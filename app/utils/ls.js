import {
  LS_STORE_NAMESPACE,
} from '../constants.js';

export function save(data) {
  if (!data) {
    localStorage.removeItem(LS_STORE_NAMESPACE);
  } else {
    localStorage.setItem(LS_STORE_NAMESPACE, JSON.stringify(data));
  }
}

export function load(key = LS_STORE_NAMESPACE) {
  return JSON.parse(localStorage.getItem(key));
}
