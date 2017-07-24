const express = require('express');
var sms_service = require('../services/sms_service');
var xola_service = require('../services/xola_service');
var body_parser = require('body-parser');
var config = require('config');

var PNF = require('google-libphonenumber').PhoneNumberFormat;
let PhoneNumberUtil = require('google-libphonenumber').PhoneNumberUtil;
var phoneUtil = PhoneNumberUtil.getInstance();

var router = express.Router();
router.use(body_parser.json());
router.use(body_parser.urlencoded({extended: true}));

var parse = function (payload, onParse) {
    let status_callback_url = config.host.url + ':' + config.host.port + '/messages/' + payload.conversation.id + '-' +
        payload.id + '/report';
    var phoneNumberString = payload.recipient.phone;
    var phoneNumberObject;

    if (phoneUtil.isPossibleNumberString(phoneNumberString, PhoneNumberUtil.UNKNOWN_REGION_)) {
        phoneNumberObject = phoneUtil.parse(phoneNumberString, PhoneNumberUtil.UNKNOWN_REGION_);
        onParse({
            "dst": phoneUtil.format(phoneNumberObject, PNF.E164),
            "text": payload.body,
            "url": status_callback_url
        })
    } else {
        xola_service.getSellerCountryCode(payload.seller.id, function (countryCode) {
            phoneNumberObject = phoneUtil.parse(phoneNumberString, countryCode);
            onParse({
                "dst": phoneUtil.format(phoneNumberObject, PNF.E164),
                "text": payload.body,
                "url": status_callback_url
            })
        });
    }
};

router.post('/', function (request, response) {
    var onError = function (response) {
        xola_service.updateStatusInXola(request.body.data.conversation.id, request.body.data.id, 'error', response.error)
    };

    if (request.body.eventName == 'conversation.message.create' && request.body.data.type == 'sms') {
        parse(request.body.data, function (parsedData) {
            sms_service.send_message(parsedData, onError);
        })
    }
    return response.send();
});

router.post('/:convoMmessageId/report', function (request, response) {
    const convoMessageId = 'convoMmessageId';
    var conversationId = request.params[convoMessageId].split("-")[0];
    var messageId = request.params[convoMessageId].split("-")[1];
    var status = request.body.Status || request.query.Status;

    xola_service.updateStatusInXola(conversationId, messageId, status, status);
    return response.send();
});

router.get('/', function (request, response) {
    return response.send();
});

module.exports = router;