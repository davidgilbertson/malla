let startTime;
import now from 'performance-now';

export function start(str) {
  startTime = now();
  str && console.info('starting', str)
}

export function log(name, keepRunning) {
  if (!startTime) start();

  const ms = now() - startTime;
  const roundMs = Math.round(ms * 10000) / 10000;

  console.info(`${roundMs}ms (${name})`);

  if (!keepRunning) start();
}
