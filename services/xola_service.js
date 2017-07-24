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
