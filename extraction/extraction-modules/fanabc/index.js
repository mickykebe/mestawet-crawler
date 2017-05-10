const extract = require('../../scraper');

module.exports = () =>
    extract(`${__dirname}/config.json`)
        .then((results) => {
            if (results.length === 0) {
                return [];
            }
            const firstPage = results.slice(0, 4);
            const secondPage = results.slice(8, 12);
            const thirdPage = results.slice(16, 20);
            return [...firstPage, ...secondPage, ...thirdPage];
        });
