const cron = require('node-cron');
const http = require('http');
const fs = require('fs');

function getModuleFiles() {
    return new Promise((resolve, reject) => {
        fs.readdir(`${__dirname}/extraction`, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

/* function readConfig(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/extraction/config/${fileName}`, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}*/

function fetch(file) {
    const extractFn = require(`${__dirname}/extraction/${file}`);
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


function fetchBatch() {
    const readable = fs.createReadStream(`${__dirname}/sent-post-urls.json`);
    let sentPostUrls;
    let rawSentPostUrls = '';

    readable.on('data', (data) => {
        rawSentPostUrls += data;
    }).on('end', () => {
        sentPostUrls = JSON.parse(rawSentPostUrls);
        getModuleFiles()
            .then(files => Promise.all(files.map(fetch)))
            .then(results => extractNewPosts(results, sentPostUrls))
            .then(console.log)
            .catch(console.log);
    });
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
