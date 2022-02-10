const esClient = require('../config/elasticsearch');

async function createRoom(owner, name) {
  try {
    await esClient.client.index({
      index: esClient.ROOMS_INDEX,
      body: {
        owner,
        name,
        createdAt: new Date().toISOString(),
      }
    })
    console.log(`Created room ${name} owned by ${owner}`);
} catch (err) {
    console.error(`An error occurred while creating the room ${name}:`);
    console.log(err);
}
}

module.exports = {
  createRoom
}

/*

may not need this.
weird bug, didn't work if you pulled schema in from here
const RoomSchema = {
    "owner": {
        "type": "text",
      },
      "name": {
        "type": "text",
      }
}

module.exports = {
    RoomSchema
}*/