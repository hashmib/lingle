var model = require('../models');
var parser = require('../utils/whatsappchatparser');
var builder = require('../utils/wordsbuilder');
let utilities = require ('../utils/shared');


async function createRoomController(req, res) {

  try {
    if (!req.files || !req.body.name) {
      res.status(400).json({ success: false, error: "Error, you did not upload the correct file format or provide a name"});
    } 
    else {
      let uploadedChat = req.files.file;
      let roomUuid = utilities.parseRoomNameAndGetUuid(req.body.name);

      // Check if room exists
      let roomExists = await model.checkRoomExists(roomUuid);
      if (!roomExists) {
        // Convert data stream buffer to string and pass that into the chat parser. Will return { messages, words } arrays
        let parsedChat = parser.parseChat(uploadedChat.data.toString('utf8'), roomUuid);

        // Build our lingle word population. Using only 5 letter words that aren't the Wordle answers
        let lingleWords = await builder.buildLingleWords(parsedChat.words, roomUuid);

        console.log(`Uploading chat for room ${roomUuid}`);
        
        let result = await model.populateWordsForRoom(parsedChat.messages, lingleWords); 

        // Send response back to client
        res.send({success: true, data: roomUuid});
        console.log(`Populated words for room ${roomUuid}`);
      }
      else {
        res.status(400).json({ success: false, error: "Error, a room with this name already exists"});
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: "There was an error uploading your file."});
  }

}


async function hintController(req, res) {

  try {
    if (!req.query.word || !req.query.room) {
      res.status(400).json({ success: false, error: "Error, you did not provide the correct parameters"});
    }
    else {
      // Extract word from query param, roomName from body, and make call to elastic client
      let word = req.query.word;
      let roomUuid = utilities.parseRoomNameAndGetUuid(req.query.room);
        
      // Call model method -> build term frequency map by sender -> unsorted -> return
      let result = await model.getHintForWord(word, roomUuid);
      res.send({success: true, hints: result});
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: "Error with HintController. Please try again."});
  }

}


async function wordOfTheDayController(req, res) {

  try {
    if (!req.query.name) {
      res.status(400).json({ success: false, error: "error, you did not provide a name"});
    }
    else {
      let roomUuid = utilities.parseRoomNameAndGetUuid(req.query.name);

      // Check if room exists
      let roomExists = await model.checkRoomExists(roomUuid);
      if (roomExists) {
        let result = await model.getWordOfTheDay(roomUuid);
        
        // Shuffle result, remove objects with a frequency of 1
        // s/o Hassan Ali
        result = utilities.shuffleList(result);
        result = result.filter(word => word.frequency > 5);

        // Return response to client
        res.send({success: true, words: result});
      }
      else {
        res.status(404).json({ success: false, error: "Error, no such room with this name was found. Create it!"});
      }
    }
  } catch (err) {
    console.log(`Word of the Day Controller Error:\n ${err}`);
    res.status(500).json({ success: false, error: "There was an error getting the word of the day."});
  }

}


module.exports = {
  createRoomController,
  wordOfTheDayController,
  hintController
}