const Xray = require('x-ray');
const defaultConfig = require('./default-config');
const utils = require('./utils');

const xray = Xray().delay(defaultConfig.delayFrom, defaultConfig.delayTo);

const scrapeUrl = 'http://ethiopianreporter.com/tags/%E1%8B%9C%E1%8A%93';

function scrape() {
    return new Promise((resolve, reject) => {
        xray(scrapeUrl, 'article', [{
            title: '.post-title h3 a',
            url: '.post-title h3 a@href',
            description: '.post-content-innder p',
            thumbnailUrl: 'img@src',
        }])
        .paginate('.pager-next a@href')
        .limit(2)((err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.map(utils.makeArticleType));
            }
        });
    }).catch((error) => {
        console.warn(`Scrape failure on url ${scrapeUrl}`, error);
        return [];
    });
}

module.exports = scrape;
