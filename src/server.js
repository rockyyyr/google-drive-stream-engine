const express = require('express');
const cors = require('cors');
const google = require('./google');

const server = express();

server.use(express.json());
server.use(cors());
server.set('trust proxy', true);

server.get('/stream/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { q } = req.query;
        const sources = await google.getFileInfo(id);
        const source = sources.find(source => source.resolution === q);

        res.setHeader('content-type', 'video/mp4');
        google.fetchVideo(source, req, res);

    } catch (error) {
        console.error(error);
    }
});

let instance;

process.on('SIGTERM', stop);

/**
 * Start the stream server
 * 
 * @param {number} port 
 */
function start(port, logging = false) {
    instance = server.listen(port, () => logging && console.log(`Google drive stream server listening on port ${port}`));
}

/**
 * Stop the stream server
 */
function stop() {
    if (instance) {
        instance.close();
    }
}

module.exports = {
    start,
    stop
};
