var xola_http_client = require('../clients/xola_http_client');

var exports = module.exports = {};

exports.updateMessageStatus = function (conversationId, messageId, status, reason) {

    var relativeUrl = '/api/conversations/' + conversationId + '/messages/' + messageId;
    var payload = {
        status: status,
        error: reason
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("status updated to: " + status);
        } else {
            console.log("error while updating status: " + error);
        }
    }

    xola_http_client.put(relativeUrl, payload, callback);
};

exports.getSellerCountryCode = function (sellerId, onSuccess) {
    let relativeUrl = '/api/sellers/' + sellerId;

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(response.body);
            console.log("fetched country code : " + body["countryCode"] + " for sellerid: " + sellerId);
            onSuccess(body.countryCode)
        } else {
            console.log("error fetching seller country code: " + error);
        }
    }

    xola_http_client.get(relativeUrl, callback);
};

exports.updateSmsCounter = function (sellerId, sentMessagesCount) {

    let relativeUrl = '/api/sellers/' + sellerId + '/counters/sms';

    let payload = {
        count: sentMessagesCount
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("SMS counter updated successfully by : " + sentMessagesCount + " for seller: " + sellerId);
        } else {
            console.log("error updating SMS counter " + response.statusCode);
        }
    }

    xola_http_client.put(relativeUrl, payload, callback);
};