let startTime;

export function start() {
  startTime = process.hrtime();
}

export function log(name, keepRunning) {
  if (!startTime) start();
  const end = process.hrtime(startTime);

  const ms = end[0] * 1000  + end[1] / 1000000;
  const roundMs = Math.round(ms * 10000) / 10000;

  console.info(`${roundMs}ms (${name})`);

  if (!keepRunning) start();
}
