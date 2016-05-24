process.env.NODE_ENV = 'development';

require('babel-register');
require('./app/setupGlobalVariables.js');
require('./app/server.js');
require('./build/runDevServer.js');
