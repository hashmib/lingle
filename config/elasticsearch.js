const { Client } = require('@elastic/elasticsearch');
const esUrl = process.env.ELASTIC_URL || 'http://elasticsearch:9200';
const client = new Client({ node: esUrl });
const schema = require('../models');


const ROOMS_INDEX = 'rooms';
const DOCS_INDEX = 'docs';


/** Creates new index
 * @description Creates new index in Elasticsearch
 */
async function createRoomIndex() {
    try {
        await client.indices.create({
            index: ROOMS_INDEX,
            body: {
                "mappings": {
                    "properties": {
                        "owner": {
                          "type": "text",
                        },
                        "name": {
                          "type": "text",
                        },
                        "createdAt": {
                            "type": "date",
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
    createRoomIndex,
    checkConnection
}

