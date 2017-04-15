const assert = require('assert');
const extractAddisadmas = require('../extraction/addisadmas.js');
const extractEthiopianreporter = require('../extraction/ethiopianreporter.js');
const extractSatenaw = require('../extraction/satenaw.js');
const extractZehabesha = require('../extraction/zehabesha.js');
const extractFanabc = require('../extraction/fanabc.js');

describe('test extractors', function () {
    this.timeout(60000);

    function assertPostFields(post) {
        assert(post.type === 'article');
        assert(post.title !== '');
        assert(post.url !== '');
        assert(post.description !== '');
    }

    it('AddisAdmas', (done) => {
        extractAddisadmas().then((results) => {
            assert(results.length === 12);
            assertPostFields(results[0]);
            done();
        });
    });

    it('EthiopianReporter', (done) => {
        extractEthiopianreporter().then((results) => {
            assert(results.length === 20);
            assertPostFields(results[0]);
            done();
        });
    });

    it('Satenaw', (done) => {
        extractSatenaw().then((results) => {
            assert(results.length === 34);
            assertPostFields(results[0]);
            done();
        });
    });

    it('Zehabesha', (done) => {
        extractZehabesha().then((results) => {
            assert(results.length === 60);
            assertPostFields(results[0]);
            done();
        });
    });

    it('fababc', (done) => {
        extractFanabc().then((results) => {
            assert(results.length === 12);
            assertPostFields(results[0]);
            done();
        });
    });
});
