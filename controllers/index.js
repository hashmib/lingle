var model = require('../models');
var bcrypt = require('bcryptjs');
var parser = require('../utils/whatsappchatparser');


/**
 * 
 * @owner {*} req  
 * @password 
 */
async function createRoomController(req, res) {
    const body = req.body;
    if (!body.owner || !body.name || !body.password) {
      res.status(422).json({
        error: true,
        data: "Missing required parameter(s): 'owner' or 'name' or 'password'"
      });
      return;
    }
    // Hash the password before storing it in ES
    let hashedPassword = bcrypt.hashSync(body.password, process.env.BCRYPT_SALT);
    try {
      const result = await model.createRoom(body.owner, body.name);
      res.json({ 
        success: true, 
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Unknown error."});
    }
}

/**
 * @description Searches for rooms. Actually I built this just for me. 
 */
async function searchRoomController(req, res) {
    const roomName = req.query.name;
    try {
      const result = await model.searchForRoom(roomName);
      res.json({ success: true, data: result});
      
    } catch (err) {
      res.status(500).json({ success: false, error: "Unknown error."});
    }
}

async function populateWordsController(req, res) {
  try {
    if (!req.files) {
      res.status(400).json({ success: false, error: "error, you did not upload a file"});
    } 
    else {
      let uploadedChat = req.files.file;

      // Convert data stream buffer to string
      let parsedChat = parser.parseChat(uploadedChat.data.toString('utf8'));

      let result = await model.populateWordsForRoom(parsedChat);

      res.send({
          success: true,
          message: 'File is uploaded',
          data: {
              name: uploadedChat.name,
              mimetype: uploadedChat.mimetype,
              size: uploadedChat.size,
              contents: parsedChat
          }
      });
    }
} catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: "There was an error uploading your file."});
  }
}

module.exports = {
  createRoomController,
  searchRoomController,
  populateWordsController
}