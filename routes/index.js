// Initialization
var express = require('express');
var router = express.Router()

// Import controllers
var controller = require('../controllers');




router.post('/room', controller.createRoom);

module.exports = {
    router
}