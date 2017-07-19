const express = require('express');
var sms_service = require('../services/sms_service');
var body_parser = require('body-parser');
var http_request = require('request');
var config = require('config');
require('dotenv').config();

var router = express.Router();
router.use(body_parser.json());
router.use(body_parser.urlencoded({extended: true}));

var parse = function (payload) {
    let status_callback_url = config.host.url  + ':' + config.host.port + '/messages/' + payload.conversationid + '-' + payload.id + '/report';
    return {
        "dst": payload.recipient.phone,
        "text": payload.body,
        "url": status_callback_url
    }
};

var updateStatusInXola = function (conversationId, messageId, status, reason) {

    var options = {
        method: 'PUT',
        url: config.xola.url + ':' + config.xola.port + '/api/conversations/' + conversationId + '/messages/' + messageId,
        auth: {
            'user': process.env.USER_NAME || config.user.name,
            'pass': process.env.USER_PASSWORD || config.user.password
        },
        json: {
            status: status,
            reason: reason
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("status updated to: " + status);
        } else {
            console.log(error);
        }
    }

    http_request(options, callback);
};

router.post('/', function (request, response) {
    if (request.body.eventName == 'conversation.message.create') {
        sms_service.send_message(parse(request.body.data), function (response) {
            updateStatusInXola(request.body.data.conversationid, request.body.data.id, 'Error', response.error)
        });
    }
    return response.send();
});

router.post('/:convoMmessageId/report', function (request, response) {
    const convoMessageId = 'convoMmessageId';
    var conversationId = request.params[convoMessageId].split("-")[0];
    var messageId = request.params[convoMessageId].split("-")[1];
    var status = request.body.Status || request.query.Status;

    updateStatusInXola(conversationId, messageId, status, status);
    return response.send();
});

router.get('/', function (request, response) {
    return response.send();
});

module.exports = router;