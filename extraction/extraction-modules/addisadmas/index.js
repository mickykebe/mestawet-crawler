const extract = require('../../scraper');

module.exports = () =>
    extract(`${__dirname}/config.json`)
        .then((results) => {
            if (results.length === 0) {
                return results;
            }
            const firstPage = results.slice(0, 6);
            const secondPage = results.slice(10, 16);
            return [...firstPage, ...secondPage];
        });
