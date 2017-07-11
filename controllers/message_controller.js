const express = require('express');
var sms_service = require('../services/sms_service');
var body_parser = require('body-parser');
var http_request = require('request');
var config = require('config');

var router = express.Router();
router.use(body_parser.json());

var parse = function (payload) {
    let status_callback_url = config.host.url  + ':' + config.host.port + '/messages/' + payload.conversationid + '-' + payload.id + '/report';
    return {
        "dst": payload.recipient.phone,
        "text": payload.body,
        "url": status_callback_url
    }
};

var updateStatusInXola = function (request) {
    const convoMessageId = 'convoMmessageId';
    var conversationId = request.params(convoMessageId).split("-")[0];
    var messageId = request.params(convoMessageId).split("-")[1];
    var status = request.body.status;

    var options = {
        method: 'POST',
        url: config.xola.url + ':' + config.xola.port + '/conversations/' + conversationId + '/messages/' + messageId,
        headers: {
            'X-API-KEY': config.user.apiKey
        },
        json: {
            status: status
        }
    };

    function callback(error, response, body) {
        console.log("respone" + response.body);
        if (!error && response.statusCode == 200) {
            console.log("status updated");
        }
    }

    http_request(options, callback);
};

router.post('/', function (request, response) {
    console.log(request);
    if (request.body.eventName == 'conversation.message.create') {
        sms_service.send_message(parse(request.body.data));
    }
    return response.send();
});

router.post('/:convoMmessageId/report', function (request, response) {
    updateStatusInXola(request);
    return response.send();
});

router.get('/', function (request, response) {
    return response.send();
});

module.exports = router;