console.log('Starting dev mode');

process.env.APP_ENV = 'DEV';

require('./index.js');
require('./build/runDevServer.js');
