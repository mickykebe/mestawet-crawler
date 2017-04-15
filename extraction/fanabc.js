const Xray = require('x-ray');
const defaultConfig = require('./default-config');
const utils = require('./utils');

const xray = Xray().delay(defaultConfig.delayFrom, defaultConfig.delayTo);

const scrapeUrl = 'http://www.fanabc.com/index.php/news.html';

function scrape() {
    return new Promise((resolve, reject) => {
        xray(scrapeUrl, '.catItemView', [{
            title: '.catItemTitle a',
            url: '.catItemTitle a@href',
            description: '.catItemIntroText',
            thumbnailUrl: '.catItemImage img@src',
        }])
        .paginate('.pagination-next a@href')
        .limit(3)((err, results) => {
            if (err) {
                reject(err);
            } else {

                const firstPage = results.slice(0, 4);
                const secondPage = results.slice(8, 12);
                const thirdPage = results.slice(16, 20);
                resolve([...firstPage, ...secondPage, ...thirdPage].map(utils.makeArticleType));
            }
        });
    }).catch((error) => {
        console.warn(`Scrape failure on url ${scrapeUrl}`, error);
        return [];
    });
}

module.exports = scrape;
