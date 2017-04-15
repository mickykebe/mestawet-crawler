const Xray = require('x-ray');
const defaultConfig = require('./default-config');
const utils = require('./utils');

const xray = Xray(({
    filters: {
        secondElem(value) {
            return value[0];
        },
    },
})).delay(defaultConfig.delayFrom, defaultConfig.delayTo);

const scrapeUrl = 'http://www.satenaw.com/amharic/archives/category/%E1%8B%A8%E1%8B%95%E1%88%88%E1%89%B1-%E1%8B%9C%E1%8A%93';

function scrape() {
    return new Promise((resolve, reject) => {
        xray(scrapeUrl, '.article-big', [{
            title: 'h2 a',
            url: 'h2 a@href',
            description: '.article-content p:nth-of-type(2)',
            thumbnailUrl: '.article-photo img@src',
        }])
        .paginate('a.next@href')
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
