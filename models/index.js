const esClient = require('../config/elasticsearch');

async function createRoom(owner, name, password) {
  try {
    await esClient.client.index({
      index: esClient.ROOMS_INDEX,
      body: {
        owner,
        name,
        createdAt: new Date().toISOString(),
        password,
      }
    })
    console.log(`Created room ${name} owned by ${owner}`);
} catch (err) {
    console.error(`An error occurred while creating the room ${name}:`);
    console.log(err);
  }
}

async function searchForRoom(roomName) {
  // Room name must match, & password must be correct
  try {
    const result = await esClient.client.search({
      index: esClient.ROOMS_INDEX,
      body: {
        query: {
          match: {
            name: roomName
          }
        }
      }
    });
    let searchResults = result.body.hits.hits;
    return searchResults;
  } catch (err) {
    console.error(`An error occurred while connecting and searching Elasticsearch for room ${roomName}:`);
    console.log(err);
  }
}

module.exports = {
  createRoom,
  searchForRoom
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