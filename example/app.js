
/**
 * Module dependencies.
 */

var express = require('express');

/**
 * Create app.
 */

var app = express.createServer()

/**
 * Export app.
 */

module.exports = app;

/**
 * Sample route.
 */

app.get('/', function (req, res) {
  res.send('Hi!');
});
