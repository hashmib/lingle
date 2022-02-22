const esClient = require('../config/elasticsearch');

async function getWordOfTheDay(_roomUuid) {
  // Room name must match, & password must be correct
  try {
    console.log(_roomUuid);
    const result = await esClient.client.search({
      index: esClient.WORDS_INDEX,
      body: {
        "query": {
          "match": {
            "room_uuid": _roomUuid
          }
        }
      }
    });

    // The index is already sorted by most frequent words for each room
    let topHit = result.body.hits.hits[0];

    // We now have our top hit, we will return to the client, and remove it from the index
    let clearIndex = await esClient.client.delete({
      index: esClient.WORDS_INDEX,
      id: topHit._id
    });

    // Return the object, which includes the word and frequency
    return topHit._source;

  } catch (err) {
      console.error(`An error occurred while connecting and searching Elasticsearch for word with room uuid ${_roomUuid}:`);
      console.log(err);
    }
}

async function populateWordsForRoom(_chat, _words) {
  try {
    // Uses Elastic's bulk index to index all the messages in the chat
    const body = _chat.flatMap(doc => [{ index: { _index: esClient.MESSAGES_INDEX } }, doc])
    const { body: bulkResponse } = await esClient.client.bulk({ refresh: true, body })
    console.log(`Bulk populated elasticsearch with chat`);
  } catch (err) {
      console.error(`An error occurred while populating Elasticsearch with chat:`);
      console.log(err);
  }
  try {
    // Uses Elastic's bulk index to index all the lingo words from the chat
    const body = _words.flatMap(doc => [{ index: { _index: esClient.WORDS_INDEX } }, doc])
    const { body: bulkResponse } = await esClient.client.bulk({ refresh: true, body })
    console.log(`Bulk populated elasticsearch with words`);
  } catch (err) {
      console.error(`An error occurred while populating Elasticsearch with chat:`);
      console.log(err);
  }
}

module.exports = {
  populateWordsForRoom,
  getWordOfTheDay
}