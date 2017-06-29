const Xray = require('x-ray');
const fs = require('fs');
const request = require('request-promise-native');
const hget = require('hget');
const marked = require('marked');

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

function fetchPostContent(config, post) {
  return new Promise((resolve, reject) => {
    if (!post.url) {
      reject(new Error('Failed to extract article text. Post without url field'));
    }
    if (!config.textSelector) {
      reject(new Error(`Failed to extract article text. ${post.url}: No textSelector field`));
    }
    const url = config.encodeURI ? encodeURI(post.url) : post.url;
    request(url)
      .then((html) => {
        const postText = marked(hget(html, {
          root: config.textSelector,
          markdown: true,
        }));
        resolve(postText);
      })
      .catch(reject);
  });
}

function postWithTextContent(config, post) {
  return fetchPostContent(config, post)
    .then(postText => Object.assign({}, post, { textContent: postText }))
    .catch(() => post);
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
        Promise.all(posts.map(post => postWithTextContent(config, post)))
          .then(resolve);
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
