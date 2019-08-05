'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');

var Transaction = require('dw/system/Transaction');

var CustomObjectMgr = require('dw/object/CustomObjectMgr');

var aboutmeModel = [];

var aboutmeObject;

server.get('bogs', cache.applyDefaultCache, function (req, res, next){

   Transaction.wrap(function(){
      aboutmeObject = CustomObjectMgr.getAllCustomObjects('AboutMe').asList(0, 200);

      for(var aboutmeItem in aboutmeObject){
         var item = aboutmeObject[aboutmeItem];
         if(item.type === 'AboutMe'){
            aboutmeModel.push({
               text: item.custom.text,
               description: item.custom.description
            })
         }
      }
   });

   res.render('/infoPageISML', {aboutme:aboutmeModel});
   next();
});

module.exports = server.exports();