import {WORDS} from '../constants.js';

function openWindow(url, name, size = {width: 550, height: 420}) {
  const left = Math.round((screen.width / 2) - (size.width / 2));
  const top = (screen.height > size.height)
    ? Math.round((screen.height / 2) - (size.height / 2))
    : 0;

  const features = `scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=${size.width},height=${size.height},left=${left},top=${top}`;

  window.open(url, name, features);
}

export function facebook() {
  if (typeof FB !== 'undefined') {
    FB.ui({
      method: 'share',
      href: 'http://malla.io',
    });
  } else {
    console.warn('The FB library is not loaded. No share for you.');
  }
}

export function twitter() {
  // adapted from the code at the bottom of https://dev.twitter.com/web/intents
  if (typeof window === 'undefined') return;

  const twitterUrl = 'https://twitter.com/intent/tweet';
  const via = 'malla_io';
  const text = 'Malla+is+awesome!';
  const url = encodeURIComponent('http://www.malla.io');
  const shareUrl = `${twitterUrl}?via=${via}&text=${text}&url=${url}`;

  openWindow(shareUrl, 'intent');
}

export function linkedIn() {
  // docs: https://developer.linkedin.com/docs/share-on-linkedin
  if (typeof window === 'undefined') return;

  const linkedInUrl = 'https://www.linkedin.com/shareArticle';
  const url = encodeURIComponent('http://www.malla.io');
  const title = encodeURIComponent(WORDS.MALLA);
  const summary = encodeURIComponent(WORDS.SLOGAN);
  const source = 'Malla';
  const shareUrl = `${linkedInUrl}?mini=true&url=${url}&title=${title}&summary=${summary}&source=${source}`;

  openWindow(shareUrl, 'linkedIn', {width: 520, height: 570});
}
