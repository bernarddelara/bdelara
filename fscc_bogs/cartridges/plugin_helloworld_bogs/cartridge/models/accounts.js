'use strict'

function getPreferences(profile){

    var preferences = [];

    profile.custom.preferences.forEach(function(preference){
        preferences.push({id: preference.value, value: preference.displayValue});
    });
    return preferences;
}

module.exports = function(currentCustomer, addressModel, ordermodel){
    module.superModule.call(this, currentCustomer, addressModel, ordermodel);
    this.preferences = getPreferences(currentCustomer.raw.profile); //object is profile not case sensitive
}