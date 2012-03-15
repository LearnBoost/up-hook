
/**
 * Module dependencies.
 */

var child_process = require('child_process')
  , bodyParser = require('connect').bodyParser()
  , debug = require('debug')('up-hook')

/**
 * Module exports.
 */

module.exports = uphook;

/**
 * Executes commands execution in order
 */

var queue = []
  , running

function exec (cmd, opts, fn) {
  if (running) {
    debug('queuing command "%s"', cmd);
    queue.push([cmd, opts, fn]);
  } else {
    debug('running command "%s"', cmd);
    run(cmd, opts, fn);
  }

  function run (cmd, opts, fn) {
    running = child_process.exec(cmd, opts, function () {
      fn && fn.apply(null, arguments);
      running = null;
      if (queue.length) run.apply(null, queue.shift());
    });
  }
}

/**
 * Uphook middleware.
 *
 * Options:
 *   - branch: `String|false` branch to capture (`master`)
 *   - cmd: `String` command to execute (`git pull`)
 *   - cwd: `String` optional dir to execute process in
 *
 * @param {String} url
 * @param {Object|Function} (optional) options, or callback
 * @param {Function} (optional) callback
 * @api public
 */

function uphook (url, opts, fn) {
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }

  var opts = opts || {}
    , branch = opts.branch || 'master'
    , cmd = opts.cmd || 'git pull'

  return function (req, res, next) {
    if (url == req.url && 'POST' == req.method) {
      var server = this
        , payload

      // get payload
      bodyParser(req, res, function (err) {
        if (err) return next(err);

        debug('got github payload "%s"', req.body.payload);

        try {
          payload = JSON.parse(req.body.payload);
        } catch (e) {
          next(new Error('GitHub payload error'));
        }

        if (!branch || ('refs/heads/' + branch == payload.ref)) {
          debug('got commit to ref "%s" - reloading', payload.ref);

          if (cmd) {
            exec(cmd, { cwd: opts.cwd }, function (err) {
              if (!err) {
                debug('command successful - reloading');
                server.reload();
              }
              fn && fn(err);
            });
          } else {
            debug('reloading');
            server.reload();
            fn && fn(null);
          }
        } else {
          debug('ignoring commit to ref "%s"', payload.ref);
        }

        // respond
        res.writeHead(200);
        res.end();
      });
    } else {
      debug('ignoring request');
      next();
    }
  };
}
