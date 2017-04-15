const Xray = require('x-ray');
const defaultConfig = require('./default-config');
const utils = require('./utils');

const xray = Xray(defaultConfig.delayFrom, defaultConfig.delayTo);

const scrapeUrl = 'http://www.zehabesha.com/amharic/?cat=1';

function scrape() {
    return new Promise((resolve, reject) => {
        xray(scrapeUrl, '.post', [{
            title: 'h2 a',
            url: 'h2 a@href',
            thumbnailUrl: 'img@src',
            description: 'p',
        }])
        .paginate('a.pagi-next@href')
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
