var plivo = require('plivo');
var config = require('config');

const restAPI = plivo.RestAPI({
    authId: config.plivo.authId,
    authToken: config.plivo.authToken
});


var exports = module.exports = {};

exports.send_message = function (data, onError) {
    var params = {
        'dst': data.dst,
        'src': config.plivo.senderId,
        'text': data.text,
        'url': data.url
    };

    restAPI.send_message(params, function (status, response) {
        if (status === 400) {
            onError(response);
        }
        console.log('Status: ', status);
        console.log('API Response:\n', response);
    });
};
