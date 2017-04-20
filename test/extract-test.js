const assert = require('assert');
const youtubeConfig = require('../extraction/extraction-modules/youtube/config');
const extractAddisadmas = require('../extraction/extraction-modules/addisadmas');
const extractEthiopianreporter = require('../extraction/extraction-modules/ethiopianreporter');
const extractSatenaw = require('../extraction/extraction-modules/satenaw');
const extractZehabesha = require('../extraction/extraction-modules/zehabesha');
const extractFanabc = require('../extraction/extraction-modules/fanabc');
const extractYoutube = require('../extraction/extraction-modules/youtube');

describe('test extractors', function () {
    this.timeout(60000);

    function assertArticleFields(post) {
        assert(post.type === 'article');
        assert(post.title !== '');
        assert(post.url !== '');
        assert(post.description !== '');
    }

    function assertVideoFields(post) {
        assert(post.type === 'video');
        assert(post.videoId !== '');
        assert(post.title !== '');
    }

    it('AddisAdmas', (done) => {
        extractAddisadmas().then((results) => {
            assert(results.length === 12);
            assertArticleFields(results[0]);
            done();
        });
    });

    it('EthiopianReporter', (done) => {
        extractEthiopianreporter().then((results) => {
            assert(results.length === 20);
            assertArticleFields(results[0]);
            done();
        });
    });

    it('Satenaw', (done) => {
        extractSatenaw().then((results) => {
            assert(results.length === 34);
            assertArticleFields(results[0]);
            done();
        });
    });

    it('Zehabesha', (done) => {
        extractZehabesha().then((results) => {
            assert(results.length === 60);
            assertArticleFields(results[0]);
            done();
        });
    });

    it('fanabc', (done) => {
        extractFanabc().then((results) => {
            assert(results.length === 12);
            assertArticleFields(results[0]);
            done();
        });
    });

    it.only('youtube', (done) => {
        extractYoutube().then((results) => {
            const { channels, videosPerChannel } = youtubeConfig;
            assert(results.length === channels.length * videosPerChannel);
            assertVideoFields(results[0]);
            done();
        });
    });
});
