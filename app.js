const cron = require('node-cron');
const http = require('http');
const fs = require('fs');
const config = require('./config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Post = require('./models/post');

mongoose.Promise = global.Promise;

function getModules() {
    return new Promise((resolve, reject) => {
        fs.readdir(`${__dirname}/extraction/extraction-modules`, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const modules = files.map(moduleFile =>
                    require(`${__dirname}/extraction/extraction-modules/${moduleFile}`));
                resolve(modules);
            }
        });
    });
}

function getPostId(post) {
    return post.url || post.videoId;
}

function filterNewSourcePosts(sourcePosts) {
    return sourcePosts.reduce((sequence, post) =>
        sequence.then(newPosts =>
            new Promise((resolve) => {
                const postKey = getPostId(post);
                Post.count({ _id: postKey })
                    .then((count) => {
                        if (count === 0) {
                            newPosts.push(post);
                        }
                        resolve(newPosts);
                    });
            })), Promise.resolve([]));
}

function filterNewPosts(postCollection) {
    return Promise.all(postCollection.map(filterNewSourcePosts))
        .then(newPostCollection =>
            newPostCollection.reduce((sequence, sitePosts) =>
                sequence.concat(sitePosts),
            []));
}

function postToServer(posts) {
    return new Promise((resolve, reject) => {
        if (posts && posts.length === 0) {
            reject('No new posts to send');
            return;
        }
        const token = jwt.sign(config.jwtPayload, config.tokenSecret);
        const options = {
            hostname: config.serverHostName,
            port: config.serverPort,
            path: config.postPath,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.setEncoding('utf-8');
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                body = JSON.parse(body);
                if (body.success === true) {
                    resolve(posts);
                } else {
                    reject(body.message);
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

function saveSentPost(post) {
    return Post.create(post)
        .catch((err) => {
            if (err.code === 11000) {
                return null;
            }
            throw err;
        });
}

function saveSentPosts(posts) {
    const dbPosts = posts.map(post => ({ _id: getPostId(post) }));
    return Promise.all(dbPosts.map(saveSentPost));
}


function fetchBatch() {
    console.log('Started crawl session ...');
    getModules()
        .then(modules => Promise.all(modules.map(module => module())))
        .then(filterNewPosts)
        .then(postToServer)
        .then(saveSentPosts)
        .then(() => console.log('Crawl complete.'))
        .catch(console.log);
}

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/dallol_crawler');
}

module.exports = () => {
    cron.schedule('30 * * * *', fetchBatch);

    fetchBatch();
};
module.exports.filterNewPosts = filterNewPosts;
module.exports.saveSentPosts = saveSentPosts;
