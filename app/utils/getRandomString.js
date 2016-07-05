const base = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function getRandomString(len = 20) {
  const chars = [];

  for (let i = 0; i < len; i++) {
    chars.push(base.charAt(Math.floor(Math.random() * base.length)));
  }

  return chars.join('');
}
