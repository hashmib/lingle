const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser')
const morgan = require('morgan');

// Module imports
const config = require('../config');
const routes = require('../routes');

// Initializes and starts new Express server.
function initServer() {
    // Parsing middleware to format in JSON
    app.use(bodyParser.json({limit: '25mb'}));
    app.use(bodyParser.urlencoded({ extended: true, limit: '25mb' }));

    // Set up logging
    app.use(morgan('tiny'));

    // Create server health check endpoint
    app.get('/', (req, res) => { res.send('Lingle server is running'); });
    app.get('/healthcheck', (req, res) => { res.send('Lingle server is running'); });

    // Enable CORS for all requests
    app.use(cors());

    // Connect all our routes to our application
    app.use('/api/', routes.router);
    app.listen(config.applicationPort, () => console.log(`Server listening on port ${config.applicationPort}`));
}

module.exports = {
    initServer
}