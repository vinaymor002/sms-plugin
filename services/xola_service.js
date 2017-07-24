var http_request = require('request');
var config = require('config');
require('dotenv').config();

var exports = module.exports = {};

exports.updateStatusInXola = function (conversationId, messageId, status, reason) {

    var options = {
        method: 'PUT',
        url: config.xola.url + ':' + config.xola.port + '/api/conversations/' + conversationId + '/messages/' + messageId,
        auth: {
            'user': process.env.USER_NAME || config.user.name,
            'pass': process.env.USER_PASSWORD || config.user.password
        },
        json: {
            status: status,
            error: reason
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("status updated to: " + status);
        } else {
            console.log("error updating status: " + response.statusCode);
        }
    }

    http_request(options, callback);
};

exports.getSellerCountryCode = function (sellerId, onSuccess) {

    var options = {
        method: 'GET',
        url: config.xola.url + ':' + config.xola.port + '/api/sellers/' + sellerId,
        auth: {
            'user': process.env.XOLA_USER_NAME || config.user.name,
            'pass': process.env.XOLA_USER_PASSWORD || config.user.password
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(response.body);
            console.log("fetched country code : " + body["countryCode"] + " for sellerid: " + sellerId);
            onSuccess(body.countryCode)
        } else {
            console.log("error fetching seller country code: " + response.statusCode);
        }
    }

    http_request(options, callback);
};