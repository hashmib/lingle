// Initialization
var express = require('express');
var router = express.Router()

// Import controllers
var controller = require('../controllers');


// Room APIs
router.get('/room', controller.searchRoomController);
router.post('/room', controller.createRoomController);
router.post('/room/populatewords', controller.populateWordsController);

module.exports = {
    router
}