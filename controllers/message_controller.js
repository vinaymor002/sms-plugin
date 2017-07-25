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
    let status_callback_url = config.host.url + ':' + config.host.port +
        '/sellers/' + payload.seller.id +
        '/conversations/' + payload.conversation.id +
        '/messages/' + payload.id + '/report';
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

router.post('/messages', function (request, response) {
    var onError = function (response) {
        xola_service.updateMessageStatus(request.body.data.conversation.id, request.body.data.id, 'error', response.error)
    };

    if (request.body.eventName == 'conversation.message.create' && request.body.data.type == 'sms') {
        parse(request.body.data, function (parsedData) {
            sms_service.send_message(parsedData, onError);
        })
    }
    return response.send();
});

router.post('/sellers/:sellerId/conversations/:conversationId/messages/:messageId/report', function (request, response) {
    var sellerId = request.params['sellerId'];
    var conversationId = request.params['conversationId'];
    var messageId = request.params['messageId'];

    var status = request.body.Status;
    var units = request.body.Units;
    var ParentMessageUUID = request.body.ParentMessageUUID;
    var MessageUUID = request.body.MessageUUID;

    xola_service.updateMessageStatus(conversationId, messageId, status, status);
    if (status == 'sent' && ParentMessageUUID === MessageUUID) {
        xola_service.updateSmsCounter(sellerId, units);
    }
    return response.send();
});

router.get('/', function (request, response) {
    return response.send();
});

module.exports = router;