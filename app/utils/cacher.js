let responseCache = {};

function isHome(req) {
  return req.url === '/';
}

function isScreen(req) {
  return req.url.startsWith('/s/');
}

export function cacheResponse(req, responsePayload) {
  if (isHome(req)) {
    responseCache.home = responsePayload;
  }

  if (isScreen(req)) {
    responseCache.screen = responsePayload;
  }
}

export function load(req) {
  if (isHome(req)) return responseCache.home;

  if (isScreen(req)) return responseCache.screen;

  return false;
}
