var model = require('../models');

async function createRoom(req, res) {
    const body = req.body;
    if (!body.owner || !body.name) {
      res.status(422).json({
        error: true,
        data: "Missing required parameter(s): 'owner' or 'name'"
      });
      return;
    }
    try {
      const result = await model.createRoom(body.owner, body.name);
      res.json({ 
        success: true, 
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Unknown error."});
    }
  }


module.exports = {
  createRoom
}