const cron = require('node-cron');
const http = require('http');
const fs = require('fs');
const config = require('./config');

function getSentUrls(filePath) {
    return new Promise((resolve, reject) => {
        const readable = fs.createReadStream(filePath);
        let sentPostUrls = '';

        readable.on('data', (data) => {
            sentPostUrls += data;
        }).on('end', () => {
            sentPostUrls = JSON.parse(sentPostUrls);
            resolve(sentPostUrls);
        }).on('error', (error) => {
            reject(`Error reading sent posts \n ${error}`);
        });
    });
}

function getModuleFiles() {
    return new Promise((resolve, reject) => {
        fs.readdir(`${__dirname}/extraction/extraction-modules`, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

function fetch(module) {
    const extractFn = require(`${__dirname}/extraction/extraction-modules/${module}`);
    return extractFn();
}

function extractNewPosts(postCollection, sentPostUrls) {
    const newPosts = [];
    postCollection.forEach((sitePosts) => {
        sitePosts.forEach((post) => {
            if (sentPostUrls.findIndex(url => url === post.url || '') === -1) {
                newPosts.push(post);
            }
        });
    });
    return newPosts;
}

function postToServer(posts) {
    return new Promise((resolve, reject) => {
        if (posts && posts.length === 0) {
            reject('No new posts to send');
            return;
        }
        const options = {
            hostname: config.serverHostName,
            port: config.serverPort,
            path: config.postPath,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            if (res.statusCode !== 200) {
                reject('Problem occurred processing posts on server');
                return;
            }
            res.setEncoding('utf-8');
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                if (body === 'Posts saved successfully') {
                    resolve(posts);
                } else {
                    reject('Problem occurred processing posts on server');
                }
            });
        });

        req.on('error', (e) => {
            reject(`Error sending posts to server \n ${e}`);
        });

        req.write(JSON.stringify(posts));
        req.end();
    });
}

function addToSentUrls(newPosts, sentPostUrls, sentUrlsFilePath) {
    return new Promise((resolve, reject) => {
        const newPostUrls = newPosts.map(post => post.url);
        const writable = fs.createWriteStream(sentUrlsFilePath, { encoding: 'utf8' });
        sentPostUrls = [...sentPostUrls, ...newPostUrls];
        writable.write(JSON.stringify(sentPostUrls), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(newPosts);
            }
        });
    });
}


function fetchBatch() {
    let sentPostUrls;
    const sentUrlsFilePath = `${__dirname}/sent-post-urls.json`;
    getSentUrls(sentUrlsFilePath)
        .then((postUrls) => {
            sentPostUrls = postUrls;
            return getModuleFiles();
        })
        .then(modules => Promise.all(modules.map(fetch)))
        .then(results => extractNewPosts(results, sentPostUrls))
        .then(postToServer)
        .then(posts => addToSentUrls(posts, sentPostUrls, sentUrlsFilePath))
        .then(console.log)
        .catch(console.log);
}

fetchBatch();


/* http.get('http://www.addisadmassnews.com/index.php?option=com_k2&view=itemlist&layout=category&task=category&id=1&Itemid=180&format=feed&type=atom',
    (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            parseString(data, (err, result) => {
                console.log(result.feed.entry[0].link[0]);
            });
        });
    });*/
