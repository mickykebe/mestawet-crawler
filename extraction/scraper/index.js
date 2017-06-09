const Xray = require('x-ray');
const fs = require('fs');

const xray = Xray().delay(5000, 9000);

function readConfig(configFile) {
    return new Promise((resolve, reject) => {
        fs.readFile(configFile, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

function scrape(config) {
    const { sourceId, url, scope, selectors, paginate, limit, postType } = config;

    return new Promise((resolve, reject) => {
        const xrayFn = xray(url, scope, [selectors])
            .limit(limit);
        if (limit > 0) {
            xrayFn.paginate(paginate);
        }
        xrayFn((err, results) => {
            if (err) {
                reject(err);
            } else {
                const posts = results.map((post) => {
                    post.type = postType;
                    post.sourceId = sourceId;
                    return post;
                });
                resolve(posts);
            }
        });
    }).catch((error) => {
        console.warn(`Scrape failure on url ${url}`, error);
        return [];
    });
}


function extract(configPath) {
    return readConfig(configPath)
        .then(scrape);
}

module.exports = extract;
