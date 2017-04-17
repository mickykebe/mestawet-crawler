const assert = require('assert');
const extractAddisadmas = require('../extraction/extraction-modules/addisadmas');
const extractEthiopianreporter = require('../extraction/extraction-modules/ethiopianreporter');
const extractSatenaw = require('../extraction/extraction-modules/satenaw');
const extractZehabesha = require('../extraction/extraction-modules/zehabesha');
const extractFanabc = require('../extraction/extraction-modules/fanabc');

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

    it.only('fanabc', (done) => {
        extractFanabc().then((results) => {
            assert(results.length === 12);
            assertPostFields(results[0]);
            done();
        });
    });
});
