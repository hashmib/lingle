const esClient = require('../config/elasticsearch');

const MAX_SIZE_HITS = 1000;

async function getWordOfTheDay(_roomUuid) {
  // Searches docs by room uuid and returns the word of the day
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
      },
      size: MAX_SIZE_HITS
    });

    // The index is already sorted by most frequent words for each room
    let rawResponse = result.body.hits.hits;
    let wordHits = [];

    for (let i in rawResponse) {
      wordHits.push(rawResponse[i]._source);
    }

    // Return the object, which includes the word and frequency
    return wordHits;

  } catch (err) {
      console.error(`An error occurred while connecting and searching Elasticsearch for word with room uuid ${_roomUuid}:`);
      console.log(err);
    }
}


async function checkRoomExists(_roomUuid) {
  try {
    const result = await esClient.client.search({
      index: esClient.MESSAGES_INDEX,
      body: {
        "query": {
          "match": {
            "room_uuid": _roomUuid
          }
        }
      }
    });
    return result.body.hits.total.value > 0;
  } catch (err) {
      console.error(`An error occurred while checking if room exists:`);
      console.log(err);
  }
}

// Builds a term frequency map for the given word by sender
async function getHintForWord(_word, _roomUuid) {
  try {
    const result = await esClient.client.search({
      index: esClient.MESSAGES_INDEX,
      body: {
        "query": {
          "bool": {
            "must": [
              {
                "match": {
                  "message": _word
                }
              },
              {
                "match": {
                  "room_uuid": _roomUuid
                }
              }
            ]
          }
        },
        "_source": {
            "includes": ["sender"]
        }
      },
      size: MAX_SIZE_HITS
    });

    // The index is already sorted by most frequent words for each room
    let rawResponse = result.body.hits.hits;
    let termFrequencyMap = {};

    for (let i in rawResponse) {
      let sender = rawResponse[i]._source.sender;
      if (termFrequencyMap[sender]) {
        termFrequencyMap[sender]++;
      }
      else {
        termFrequencyMap[sender] = 1;
      }
    }

    return termFrequencyMap;

  } catch (err) {
      console.error(`An error occurred while connecting and searching Elasticsearch for hint`);
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
  checkRoomExists,
  getWordOfTheDay,
  getHintForWord
}