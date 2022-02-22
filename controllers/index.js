var model = require('../models');
var bcrypt = require('bcryptjs');
var parser = require('../utils/whatsappchatparser');
var builder = require('../utils/wordsbuilder');
let nameParser = require ('../utils/shared');


async function createRoomController(req, res) {
  // TODO: Check if room exists
  try {
    if (!req.files || !req.body.name) {
      res.status(400).json({ success: false, error: "error, you did not upload a file / provide a name"});
    } 
    else {
      let uploadedChat = req.files.file;
      let roomUuid = nameParser.parseRoomNameAndGetUuid(req.body.name);

      console.log(`Uploading chat for room ${roomUuid}`);

      // Convert data stream buffer to string and pass that into the chat parser. Will return { messages, words } arrays
      let parsedChat = parser.parseChat(uploadedChat.data.toString('utf8'), roomUuid);

      // Build our lingle word population. Using only 5 letter words that aren't the Wordle answers
      let lingleWords = await builder.buildLingleWords(parsedChat.words, roomUuid);
      
      let result = await model.populateWordsForRoom(parsedChat.messages, lingleWords); 

      // Send response back to client
      res.send({success: true, data: roomUuid});
      console.log(`Populated words for room ${roomUuid}`);
    }
} catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: "There was an error uploading your file."});
  }
}


async function wordOfTheDayController(req, res) {
  try {
    if (!req.query.name) {
      res.status(400).json({ success: false, error: "error, you did not provide a name"});
    }
    else {
      let roomUuid = nameParser.parseRoomNameAndGetUuid(req.query.name);
      let result = await model.getWordOfTheDay(roomUuid);
      res.send({success: true, word: result});
    }
  } catch (err) {
    console.log(`Word of the Day Controller Error:\n ${err}`);
    res.status(500).json({ success: false, error: "There was an error getting the word of the day."});
  }
}


module.exports = {
  createRoomController,
  wordOfTheDayController
}