const express = require('express');
var sms_service = require('../services/sms_service');
var body_parser = require('body-parser');
var http_request = require('request');
var config = require('config');

var router = express.Router();
router.use(body_parser.urlencoded({extended: true}));

var parse = function (payload) {
    return {
        "dst": payload.recipient.phone,
        "text": payload.body,
        "id": payload.id
    }
};

var updateStatusInXola = function (request) {
    var conversationId = request.param('convoid-messageid').split(" ")[0];
    var messageId = request.param('convoid-messageid').split(" ")[1];
    var status = request.body.status;

    var options = {
        url: config.xola.url + '/conversations/' + conversationId + '/messages/' + messageId,
        port: config.xola.port,
        headers: {
            'X-API-KEY': ''
        },
        json: {
            status: status
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("status updated");
        }
    }

    http_request(options, callback);
};

router.post('/', function (request, response) {
    sms_service.send_message(parse(request.body.data));
    return response.send();
});

router.post('/:convoid-messageid/report/', function (request, response) {
    updateStatusInXola(request);
    return response.send();
});

module.exports = router;