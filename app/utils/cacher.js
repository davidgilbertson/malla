const responseCache = {};

const EXPIRES = 5000;

function getCacheName(url) {
  if (url === '/') return 'home';

  if (url.startsWith('/s/')) return 'screen';

  return null;
}

function load(url) {
  const cacheName = getCacheName(url);
  return responseCache[cacheName];
}

export const cacher = {
  save(url, responsePayload) {
    const cacheName = getCacheName(url);
    if (!cacheName) return;
    responseCache[cacheName] = responsePayload;

    setTimeout(() => {
      delete responseCache[cacheName];
    }, EXPIRES);
  },

  checkForCache(req, res, next) {
    const cachedResponse = load(req.url);

    if (cachedResponse) {
      res.send(cachedResponse);
    } else {
      next();
    }
  },
};
