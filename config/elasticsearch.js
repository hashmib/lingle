const { Client } = require('@elastic/elasticsearch');
const esUrl = process.env.ELASTIC_URL || 'http://elasticsearch:9200';
const client = new Client({ node: esUrl });

const ROOMS_INDEX = 'rooms';
const DOCS_INDEX = 'docs';


/** Creates new index
 * @description Creates new index in Elasticsearch
 */
async function createIndices() {
    try {
        await client.indices.create({
            index: ROOMS_INDEX,
            body: {
                "mappings": {
                    "properties": {
                        "owner": {
                          "type": "keyword",
                        },
                        "name": {
                          "type": "keyword",
                        },
                        "createdAt": {
                            "type": "date",
                        },
                        "password": {
                            "type": "text",
                        }
                      }
                    }
                }
        });
        console.log(`Created index ${ROOMS_INDEX}`);
    } catch (err) {
        console.error(`An error occurred while creating the index ${ROOMS_INDEX}:`);
        console.log(err);
    }
    try {
      await client.indices.create({
          index: DOCS_INDEX,
          body: {
              "mappings": {
                  "properties": {
                      "timestamp": {
                        "type": "text",
                      },
                      "sender": {
                        "type": "keyword",
                      },
                      "message": {
                          "type": "text",
                      }
                    }
                  }
              }
      });
      console.log(`Created index ${DOCS_INDEX}`);
  } catch (err) {
      console.error(`An error occurred while creating the index ${DOCS_INDEX}:`);
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
    ROOMS_INDEX,
    DOCS_INDEX,
    createIndices,
    checkConnection
}

