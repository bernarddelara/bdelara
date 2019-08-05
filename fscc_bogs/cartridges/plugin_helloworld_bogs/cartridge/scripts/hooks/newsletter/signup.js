var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger').getLogger('bogs', 'newsletter');

//const NEWSLETTER_CO = 'CadsRegistration';

exports.subscribe = function (email){

    if(CustomObjectMgr.getCustomObject('CadsRegistration', email) === null){
        Transaction.wrap(function(){
            CustomObjectMgr.createCustomObject('CadsRegistration', email);

            Logger.warn('Email: {0}', email);
        });
    }
    else{
        Logger.warn('Newsletter subscription for email {0} does not exist', email);
    }

    return;
};