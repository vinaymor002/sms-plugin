var xola_http_client = require('../clients/xola_http_client');

var exports = module.exports = {};

exports.updateMessageDeliveryReport = function (conversationId, messageId, payload) {

    var relativeUrl = '/api/conversations/' + conversationId + '/messages/' + messageId + "/deliveryReport";

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("status updated to: " + status);
        } else {
            console.log("error while updating status: " + response.statusCode);
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
            console.log("error fetching seller country code: " + response.statusCode);
        }
    }

    xola_http_client.get(relativeUrl, callback);
};
