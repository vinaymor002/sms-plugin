var http_mocks = require('node-mocks-http');
var config = require('config');

var controller = require('../../controllers/message_controller');
var sms_service = require('../../services/sms_service');

function buildResponse() {
    return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
}


describe("Message Controller Tests", function () {
    it("post message", function (done) {
        spyOn(sms_service, 'send_message');
        var response = buildResponse();
        var request = http_mocks.createRequest({
            method: 'POST',
            url: '/',
            body: {
                "eventName": "conversation.message.create",
                "data": {
                    "id": "57e3c7c6a48cf290048b4568",
                    "from": "57e3c7c6a48cf290048b4569",
                    "type": "sms",
                    "body": "Hello, how are you?",
                    "recipient": {
                        "name": "messi",
                        "phone": "+99999999999"
                    },
                    "conversationid": "58e3c7c6a48cf290048b4568"
                }
            }
        });

        response.on('end', function () {
            expect(response.statusCode).toEqual(200);
            expect(sms_service.send_message).toHaveBeenCalledWith({
                'dst': '+99999999999',
                'text': "Hello, how are you?",
                "url": config.host.url + '/messages/58e3c7c6a48cf290048b4568-57e3c7c6a48cf290048b4568/report'
            });
            done()
        });

        controller.handle(request, response);
    });
});