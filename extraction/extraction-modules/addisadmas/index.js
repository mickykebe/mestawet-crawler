const extract = require('../../scraper');

module.exports = () =>
    extract('./config.json')
        .then((results) => {
            const firstPage = results.slice(0, 6);
            const secondPage = results.slice(10, 16);
            return [...firstPage, ...secondPage];
        });
