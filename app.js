const express = require('express');
const app = express();

var MessageController = require('./controllers/message_controller');
app.use('/messages', MessageController);

module.exports = app;