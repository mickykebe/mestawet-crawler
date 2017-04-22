const assert = require('assert');
const youtubeConfig = require('../extraction/extraction-modules/youtube/config');
const addisAdmasConfig = require('../extraction/extraction-modules/addisadmas/config');
const extractAddisadmas = require('../extraction/extraction-modules/addisadmas');
const ethiopianreporterConfig = require('../extraction/extraction-modules/ethiopianreporter/config');
const extractEthiopianreporter = require('../extraction/extraction-modules/ethiopianreporter');
const satenawConfig = require('../extraction/extraction-modules/satenaw/config');
const extractSatenaw = require('../extraction/extraction-modules/satenaw');
const zehabeshaConfig = require('../extraction/extraction-modules/zehabesha/config');
const extractZehabesha = require('../extraction/extraction-modules/zehabesha');
const fanabcConfig = require('../extraction/extraction-modules/fanabc/config');
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
            assert(results[0].sourceId = addisAdmasConfig.sourceId);
            assertArticleFields(results[0]);
            done();
        });
    });

    it('EthiopianReporter', (done) => {
        extractEthiopianreporter().then((results) => {
            assert(results.length === 20);
            assert(results[0].sourceId = ethiopianreporterConfig.sourceId);
            assertArticleFields(results[0]);
            done();
        });
    });

    it('Satenaw', (done) => {
        extractSatenaw().then((results) => {
            assert(results.length === 34);
            assert(results[0].sourceId = satenawConfig.sourceId);
            assertArticleFields(results[0]);
            done();
        });
    });

    it('Zehabesha', (done) => {
        extractZehabesha().then((results) => {
            assert(results.length === 60);
            assert(results[0].sourceId === zehabeshaConfig.sourceId);
            assertArticleFields(results[0]);
            done();
        });
    });

    it('fanabc', (done) => {
        extractFanabc().then((results) => {
            assert(results.length === 12);
            assert(results[0].sourceId === fanabcConfig.sourceId);
            assertArticleFields(results[0]);
            done();
        });
    });

    it.only('youtube', (done) => {
        extractYoutube().then((results) => {
            const { sources, videosPerChannel } = youtubeConfig;
            assert(results.length === sources.length * videosPerChannel);
            assert(results[0].sourceId === youtubeConfig.sources[0].id);
            assertVideoFields(results[0]);
            done();
        });
    });
});
