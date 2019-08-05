'use strict';

var server = require('server'); //get server
var cache = require('*/cartridge/scripts/middleware/cache');
var URLUtils = require('dw/web/URLUtils'); //get url utilities functions
var Resource = require('dw/web/Resource'); //get resources
//var csrfProtection = require('*/cartridge/scripts/middleware/csrf'); //get CSRF class -CSRFProtection allows applications to protect themselves against CSRF attacks, using synchronizer tokens, a best practice. Once created, these tokens are tied to a userâ€™s session and valid for 60 minutes.
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn'); //get userLoggedIn to validate if user is registered/logged in
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking'); //get consentTracking - get consent from tracking shopper's preferences


//add new social media
server.get(
    'Addhobby',
    consentTracking.consent,
    userLoggedIn.validateLoggedIn,
    function(req, res, next) {
        var hobbiesForm = server.forms.getForm('hobbiesBogs'); //creates empty JSON object using the form definition
        hobbiesForm.clear();
        res.render('account/editAddHobby', {
            hobbiesForm: hobbiesForm,
            breadcrumbs: [{
                    htmlValue: Resource.msg('global.home', 'common', null),
                    url: URLUtils.home().toString()
                },
                {
                    htmlValue: Resource.msg('page.title.myaccount', 'account', null),
                    url: URLUtils.url('Account-Show').toString()
                },
            ]
        });
        next();
    }
);

server.get(
    'Create',
    server.middleware.https,
    consentTracking.consent,
    function (req, res, next) {
        var hobbyForm = server.forms.getForm('hobbiesBogs');
        hobbyForm.clear();
        res.render('account/editAddHobby', {
            hobbyForm: hobbyForm
        });
        next();
    }
);

server.post(
    'SaveHobby',
    server.middleware.https,
    function (req, res, next) {
        // Transaction is always required if you have processing on diff api or saving
        var Transaction = require('dw/system/Transaction');

        // This model will render data from post
        var hobbyForm = server.forms.getForm('hobbiesBogs');

        // Form Error
        var formErrors = require('*/cartridge/scripts/formErrors');

        // Utils
        var URLUtils = require('dw/web/URLUtils');

        // CustomObjectMgr
        var CustomObjectMgr = require('dw/object/CustomObjectMgr');

        // Declare result
        var result = {
            code: hobbyForm.hobbiesId.value,
            description: hobbyForm.hobbiesDesc.value,
            date: hobbyForm.hobbiesDateCreated.value
        };

        // Check if form is valid
        if (hobbyForm.valid) {
            res.setViewData(result);
            this.on('route:BeforeComplete', function () { // eslint-disable-line no-shadow
                var formInfo = res.getViewData();

                var status;
                Transaction.wrap(function () {
                    status = { error: false };
                    try {
                        var customObj = CustomObjectMgr.createCustomObject('HobbiesBogs', formInfo.code);
                        customObj.custom.description = formInfo.description;
                        customObj.custom.date = formInfo.date;
                    } catch (e) {
                        status.error = true;
                    }
                });
                if (status.error) {
                    delete formInfo.code;
                    delete formInfo.description;
                    delete formInfo.date;

                    res.redirect(URLUtils.url('hobbiesJS-List'));
                } else {
                    delete formInfo.code;
                    delete formInfo.description;
                    delete formInfo.date;

                    res.redirect(URLUtils.url('hobbiesJS-Addhobby'));
                }
            });
        } else {
            res.redirect(URLUtils.url('hobbiesJS-Create'));
        }
        return next();
    }
);


server.get('List',
    cache.applyDefaultCache,
    server.middleware.https,
    function (req, res, next) {
        // Transaction is always required if you have processing on diff api or saving
        var Transaction = require('dw/system/Transaction');

        // CustomObjectMgr
        var CustomObjectMgr = require('dw/object/CustomObjectMgr');

        // Model Set
        var hobbyModel = [];

        var hobbyObj;
        Transaction.wrap(function () {
            hobbyObj = CustomObjectMgr.getAllCustomObjects('HobbiesBogs').asList(0, 300);
            if (hobbyObj) {
                for (var hobbyItem in hobbyObj) {
                    var item = hobbyObj[hobbyItem];
                    if (item.type === 'HobbiesBogs') {
                        hobbyModel.push({
                            code: item.custom.code,
                            description: item.custom.description,
                            date: item.custom.date
                        });
                    }
                }
            }
        });

        res.render('/account/hobbiesList', {
            hobby: hobbyModel,
            page: '1',
            breadcrumbs: [{
            htmlValue: Resource.msg('global.home', 'common', null),
            url: URLUtils.home().toString()
            },
            {
            htmlValue: Resource.msg('page.title.myaccount', 'account', null),
            url: URLUtils.url('Account-Show').toString()
            }
            ]
            });
        next();
    });

        server.get(
            'Delete',
            server.middleware.https,
            consentTracking.consent,
            function(req, res, next) {
            var hobbyForm = server.forms.getForm('hobbiesBogs');
            hobbyForm.clear();

            // Set value
            hobbyForm.hobbiesId.value = req.querystring.code;

            res.render('account/hobbiesBogsDelete', {
            code: req.querystring.code,
            hobbyForm: hobbyForm
            });
            next();
            }
            );

        server.post(
            'DeleteHobby',
            server.middleware.https,
            function (req, res, next) {
                // Transaction is always required if you have processing on diff api or saving
                var Transaction = require('dw/system/Transaction');

                // This model will render data from post
                var hobbyForm = server.forms.getForm('hobbiesBogs'); // form

                // CustomObjectMgr
                var CustomObjectMgr = require('dw/object/CustomObjectMgr');

                // Declare result
                var result = {
                    code: hobbyForm.hobbiesId.value
                };

                if (hobbyForm.valid) {
                    res.setViewData(result);

                    this.on('route:BeforeComplete', function () { // eslint-disable-line no-shadow
                        var formInfo = res.getViewData();

                        var status;
                        Transaction.wrap(function () {
                            status = { error: false };
                            try {
                                var customObj = CustomObjectMgr.getCustomObject('HobbiesBogs', formInfo.code);
                                CustomObjectMgr.remove(customObj);
                            } catch (e) {
                                status.error = true;
                            }
                        });
                        if (status.error) {
                            delete formInfo.code;

                            res.redirect(URLUtils.url('hobbiesJS-Delete'));
                        } else {
                            delete formInfo.code;

                            res.redirect(URLUtils.url('hobbiesJS-List'));
                        }
                    });
                } else {
                    res.redirect(URLUtils.url('hobbiesJS-Delete?code=' + result.code));
                }

                next();
            }
        );

        server.get(
            'EditHobby',
            server.middleware.https,
            consentTracking.consent,
            userLoggedIn.validateLoggedIn,
            function(req, res, next) {
                var Transaction = require('dw/system/Transaction');
                var CustomObjectMgr = require('dw/object/CustomObjectMgr');

                var hobbiesForm = server.forms.getForm('hobbiesBogs');
                hobbiesForm.clear();

                hobbiesForm.hobbiesId.value = req.querystring.code;
                hobbiesForm.hobbiesDesc.value = req.querystring.description;
                hobbiesForm.hobbiesDateCreated.value = req.querystring.date;

                Transaction.wrap(function() {
                    var customObj = CustomObjectMgr.getCustomObject('HobbiesBogs', req.querystring.code);
                    CustomObjectMgr.remove(customObj);
                });

                /*
                code: req.querystring.code,
                    description: req.querystring.description,
                    date: req.querystring.date,*/

                res.render('account/editAddHobby', {
                    hobbiesForm: hobbiesForm
                });

                next();
            }
        );

        server.get(
            'CreateHobby',
            server.middleware.https,
            consentTracking.consent,
            function(req, res, next) {
                var hobbyForm = server.forms.getForm('hobbiesBogs');
                hobbyForm.clear();
                res.render('account/hobbiesList');
                /*
                , {
                    hobbyForm: hobbyForm
                });  */
                next();


            }
        );


module.exports = server.exports();