// Initialization
var express = require('express');
var router = express.Router()

// Import controllers
var controller = require('../controllers');


// Room APIs
//router.get('/room', controller.searchRoomController);
router.get('/helloworld', (req, res) => { res.send('Hello World!') });
router.post('/createlingleroom', controller.createRoomController);
router.get('/wordoftheday', controller.wordOfTheDayController);
router.get('/hint', controller.hintController);

module.exports = {
    router
}