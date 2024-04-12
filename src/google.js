const axios = require('axios');

async function getFileInfo(id) {
    const responseA = await axios.get(`https://drive.google.com/get_video_info?docid=${id}`);
    const responseData = responseA.data;
    const cookie = responseA.headers['set-cookie']
        .toString()
        .split('; ')
        .find(c => c.includes('DRIVE_STREAM'));

    const decoded = decodeURI(responseData);
    const params = new URLSearchParams(decoded);
    const data = Object.fromEntries(params.entries());

    const title = data.title;
    const sources = getSources(data);

    return sources.map(x => ({
        ...x,
        cookie,
        title
    }));
};

function fetchVideo(source, req, res) {
    const headers = {
        'Connection': 'keep-alive',
        'Content-Type': 'video/mp4',
        'Cookie': source.cookie
    };

    if (req.headers.range) {
        headers.Range = req.headers.range;
    }

    return axios
        .get(source.url, { headers, responseType: 'stream', decompress: false })
        .then(video => {
            res.writeHead(video.status, video.headers);
            video.data.pipe(res);
        });
}

function getSources(data) {
    return data.fmt_stream_map
        .match(/(?=\d\d\|)\S*?(?=,\d\d\||$)/gi)
        .map(source => source.split('|'))
        .map(([index, url]) => ({ index, resolution: parseResolution(index), url }));
}

function parseResolution(string) {
    switch (string) {
        case '18': return '360p';
        case '22': return '720p';
        case '37': return '1080p';
    }
}

module.exports = {
    fetchVideo,
    getFileInfo
};
