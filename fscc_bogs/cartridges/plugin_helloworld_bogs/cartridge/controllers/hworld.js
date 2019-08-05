'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var Logger = require('dw/system/Logger').getLogger('bogs','test'); //var name in the log selection(dev setup log)

server.get('bogs', cache.applyDefaultCache, function (req, res, next) {
   Logger.warn('LOG Bogs{0}'); //used in logging
   res.render('/helloWorld');
   next();

   /*try {
      test_error;
    } catch(err) {
    
    } finally {
      Logger.warn('LOG Bogs{0}');
      res.render('/helloWorld');
    }*/
});

module.exports = server.exports();