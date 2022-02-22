// Initialization
var express = require('express');
var router = express.Router()

// Import controllers
var controller = require('../controllers');


// Room APIs
//router.get('/room', controller.searchRoomController);
router.post('/createlingleroom', controller.createRoomController);
router.get('/wordoftheday', controller.wordOfTheDayController);

module.exports = {
    router
}