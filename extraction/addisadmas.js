const Xray = require('x-ray');
const defaultConfig = require('./default-config');
const utils = require('./utils');

const xray = Xray().delay(defaultConfig.delayFrom, defaultConfig.delayTo);

const scrapeUrl = 'http://www.addisadmassnews.com/index.php?option=com_k2&view=itemlist&layout=category&task=category&id=1&Itemid=180';

function scrape() {
    return new Promise((resolve, reject) => {
        xray(scrapeUrl, '.catItemView', [{
            title: '.catItemTitle a',
            url: '.catItemTitle a@href',
            description: '.catItemIntroText',
            thumbnailUrl: '.catItemImage img@src',
        }])
        .paginate('.pagination a@href')
        .limit(2)((err, results) => {
            if (err) {
                reject(err);
            } else {
                const firstPage = results.slice(0, 6);
                const secondPage = results.slice(10, 16);
                resolve([...firstPage, ...secondPage].map(utils.makeArticleType));
            }
        });
    }).catch((error) => {
        console.warn(`Scrape failure on url ${scrapeUrl}`, error);
        return [];
    });
}

module.exports = scrape;
