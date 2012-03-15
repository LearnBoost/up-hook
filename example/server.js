
/**
 * Module dependencies.
 */

var up = require('up')
  , http = require('http')
  , uphook = require('../up-hook')

/**
 * Create http server.
 */

var httpServer = http.createServer()

/**
 * Create up server.
 */

var srv = up(httpServer, __dirname + '/app')

/**
 * Leverage uphook middleware.
 */

srv.use(uphook('/tobi', { branch: 'master', cmd: "echo 'a'" }));

/**
 * "Start me up"
 */

httpServer.listen(3000, function (err) {
  if (err) throw err;
  console.log(' \033[96m - listening on *:3000 \033[39m');
});
