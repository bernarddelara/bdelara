'use strict';

var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var HashMap = require('dw/util/HashMap');
var Mail = require('dw/net/Mail');
var Status = require('dw/system/Status');
var Template = require('dw/util/Template');

exports.export = function (jobArguments){
    var template = new Template("mail/NewsletterRegistrationExport.isml");

    var params = new HashMap();
    params.put("registration", CustomObjectMgr.getAllCustomObjects("CadsRegistration"));

    var content = template.render(params);

    var mail = template.render(params);

    var mail = new Mail();
    mail.addTo("bernard.delara@essilor.com");
    mail.setFrom("sandbox@demandware.com");
    mail.setSubject("Newsletter Subscriptions");
    mail.setContent(content);

    mail.send();

    return Status.OK;

};