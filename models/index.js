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

async function populateWordsForRoom(_chat) {
  try {
    const body = _chat.flatMap(doc => [{ index: { _index: esClient.DOCS_INDEX } }, doc])
    const { body: bulkResponse } = await esClient.client.bulk({ refresh: true, body })

    if (bulkResponse.errors) {
      const erroredDocuments = []
      // The items array has the same order of the dataset we just indexed.
      // The presence of the `error` key indicates that the operation
      // that we did for the document has failed.
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0]
        if (action[operation].error) {
          erroredDocuments.push({
            // If the status is 429 it means that you can retry the document,
            // otherwise it's very likely a mapping error, and you should
            // fix the document before to try it again.
            status: action[operation].status,
            error: action[operation].error,
            operation: body[i * 2],
            document: body[i * 2 + 1]
          })
        }
      })
      console.log(erroredDocuments)
    }
    console.log(`Populated es with chat`);
  } catch (err) {
      console.error(`An error occurred while populating Elasticsearch with chat:`);
      console.log(err);
  }
}

module.exports = {
  createRoom,
  searchForRoom,
  populateWordsForRoom
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