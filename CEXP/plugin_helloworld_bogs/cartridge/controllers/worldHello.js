'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');

server.get('World', cache.applyDefaultCache, function (req, res, next) {
   logger.warn('success{0}', 'bogs');
   res.render('/helloWorld');
   next();
});

module.exports = server.exports();