/**
 * This util makes some useful browser methods available in node
 * and some useful node methods available in the browser
 */

import now from 'performance-now';

if (typeof window === 'undefined') {
  // on the server

  if (typeof performance === 'undefined') {
    global.performance = {
      now: now,
    };
  }
} else {
  // on the client

  window.nextTick = func => window.setTimeout(func);
}
