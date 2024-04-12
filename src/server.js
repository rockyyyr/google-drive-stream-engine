const express = require('express');
const cors = require('cors');

const server = express();

server.use(express.json());
server.use(cors());
server.set('trust proxy', true);

server.get('/stream/:id', authenticate, async (req, res) => {
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

function start(port) {
    const instance = server.listen(port, () => console.log(`Google drive stream server listening on port ${port}`));

    ['SIGINT', 'SIGTERM'].forEach(signal => {
        process.on(signal, () => {
            if (instance) {
                instance.close();
            }
            if (db) {
                db.destroy();
            }
        });
    });
}

module.exports = start;
