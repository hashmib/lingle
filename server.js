const elastic = require('./config/elasticsearch');
const server_util = require('./utils/webserverinit');

(async function main() {

    const elasticReady = await elastic.checkConnection();

    // If we are connected to the es cluster, check if index exists
    if (elasticReady) {
        const roomIndexExists = await elastic.client.indices.exists({index: elastic.ROOMS_INDEX});

        // If index does not exist, create it
        if (!roomIndexExists.body) {
            await elastic.createRoomIndex();
        }

        server_util.initServer();
    }
})();