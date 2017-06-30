var plivo = require('plivo');
var config = require('config');

const restAPI = plivo.RestAPI({
    authId: config.plivo.authId,
    authToken: config.plivo.authToken
});


var exports = module.exports = {};

exports.send_message = function (data) {
    var status_callback_url = config.host.url + '/messages/' + data.id + '/report';
    var params = {
        'dst': data.dst,
        'src': config.plivo.senderId,
        'text': data.text,
        'url': status_callback_url
    };

    restAPI.send_message(params, function (status, response) {
        console.log('Status: ', status);
        console.log('API Response:\n', response);
    });
};
