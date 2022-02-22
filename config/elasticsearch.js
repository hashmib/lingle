const { Client } = require('@elastic/elasticsearch');
const esUrl = process.env.ELASTIC_URL || 'http://elasticsearch:9200';
const client = new Client({ node: esUrl });


const MESSAGES_INDEX = 'messages';
const WORDS_INDEX = 'words';


/** Creates new index
 * @description Creates new index in Elasticsearch
 */
async function createIndices() {
    try {
        await client.indices.create({
            index: MESSAGES_INDEX,
            body: {
                "mappings": {
                  "properties": {
                    "timestamp": {
                      "type": "text",
                    },
                    "sender": {
                      "type": "text",
                    },
                    "message": {
                        "type": "text",
                    },
                    "room_uuid" : {
                      "type": "keyword",
                    }
                  }
                    }
                }
        });
        console.log(`Created index ${MESSAGES_INDEX}`);
    } catch (err) {
        console.error(`An error occurred while creating the index ${MESSAGES_INDEX}:`);
        console.log(err);
    }
    try {
      await client.indices.create({
          index: WORDS_INDEX,
          body: {
              "settings": {
                "index": {
                  "sort.field": "frequency", 
                  "sort.order": "desc"  
                }
              },
              "mappings": {
                  "properties": {
                      "word": {
                        "type": "text",
                      },
                      "frequency": {
                        "type": "integer",
                      },
                      "room_uuid" : {
                        "type": "keyword",
                      }
                    }
                  }
              }
      });
      console.log(`Created index ${WORDS_INDEX}`);
  } catch (err) {
      console.error(`An error occurred while creating the index ${WORDS_INDEX}:`);
      console.log(err);
  }
}


async function checkConnection() {
    return new Promise(async (resolve) => {
  
      console.log("Checking connection to Elasticsearch...");
  
      let isConnected = false;
  
      while (!isConnected) {
  
        try {
          await client.cluster.health({});
          console.log("Successfully connected to Elasticsearch");
          isConnected = true;
        // eslint-disable-next-line no-empty
        } catch (_) {}
      }
  
      resolve(true);
  
    });
  }

module.exports = {
    client,
    MESSAGES_INDEX,
    WORDS_INDEX,
    createIndices,
    checkConnection
}

