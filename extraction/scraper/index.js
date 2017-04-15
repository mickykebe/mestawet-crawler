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
    const { url, scope, selectors, paginate, limit, postType } = config;

    return new Promise((resolve, reject) => {
        xray(url, scope, [selectors])
        .paginate(paginate)
        .limit(limit)((err, results) => {
            if (err) {
                reject(err);
            } else {
                const posts = results.map((post) => {
                    post.type = postType;
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
        .then(scrape)
        .then((results) => {
            const posts = results.map((post) => {
                post.date = Date.now();
                return post;
            });
            return posts;
        });
}

module.exports = extract;
