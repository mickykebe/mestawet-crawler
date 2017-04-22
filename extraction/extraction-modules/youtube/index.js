const https = require('https');
const config = require('./config');

function parseVideos(data) {
    if (data.items) {
        return data.items.map((item) => {
            const { videoId } = item.id;
            const { title } = item.snippet;
            const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            return { videoId, title, thumbnailUrl, type: 'video' };
        });
    }
    return [];
}

function sourceVideos(source) {
    const requestUrl = `https://www.googleapis.com/youtube/v3/search?key=${config.apiKey}&part=snippet&channelId=${source.channelId}&fields=items(id(videoId),snippet(title))&maxResults=${config.videosPerChannel}&type=video&order=date`;
    return new Promise((resolve, reject) => {
        https.get(requestUrl, (res) => {
            const { statusCode } = res;
            let data = '';
            if (statusCode !== 200) {
                reject(`statusCode: ${statusCode}`);
            } else {
                res.on('data', (chunk) => {
                    data += chunk;
                }).on('end', () => {
                    const videos = parseVideos(JSON.parse(data)).map((video) => {
                        video.sourceId = source.id;
                        return video;
                    });
                    videos.sourceId = source.id;
                    resolve(videos);
                }).on('error', (err) => {
                    reject(err);
                });
            }
        });
    }).catch((err) => {
        console.warn(`Youtube api request failure, ${err}`);
        return [];
    });
}


module.exports = () =>
    Promise.all(config.sources.map(sourceVideos))
        .then(results =>
            results.reduce((sequence, videos) =>
                sequence.concat(videos),
            []));
