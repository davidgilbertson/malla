process.env.NODE_ENV = 'production';

require('babel-register');
require('./app/setupGlobalVariables.js');
require('./app/server.js');
