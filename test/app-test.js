const assert = require('assert');
const mongoose = require('mongoose');
const app = require('../app');

const Post = mongoose.model('post');

describe('app tests', () => {
    const scrapeResults = [
        [
            {
                title: '\n\t  \t\tየውጭ ጉዳይ ሚኒስቴር ከሳውዲ ዜጎችን ለማስመለስ ኮማንድ ፖስት አቋቋመ\t  \t',
                url: 'http://www.addisadmassnews.com/index.php?option=com_k2&view=item&id=20000:የውጭ-ጉዳይ-ሚኒስቴር-ከሳውዲ-ዜጎችን-ለማስመለስ-ኮማንድ-ፖስት-አቋቋመ&Itemid=180',
                description: '\n\t  \tወደ 100 ሺህ የሚጠጉ ኢትዮጵያውያን ይመለሳሉ ተብሎ ይጠበቃል በሳኡዲ ከሚገኙ በመቶ ሺዎች የሚቆጠሩ ኢትዮጵያውያን ጥቂቶቹ ብቻ የመኖሪያ ፍቃድ እንዳላቸው የተገለፀ ሲሆን፤ መኖሪያ ፈቃድ የሌላቸው የሌላ ሀገር ዜጎች በ90 ቀናት ውስጥ ሳኡዲ አረቢያን ለቀው እንዲወጡ የታወጀውን አዋጅ ተከትሎ፣ የውጭ ጉዳይ ሚኒስቴር…\t  ',
                type: 'article',
            },
            {
                title: '\n\t  \t\tበፋሲካ በዓል የጎንደር ከብቶች ገበያውን ተቆጣጥረውታል\t  \t',
                url: 'http://www.addisadmassnews.com/index.php?option=com_k2&view=item&id=19999:በፋሲካ-በዓል-የጎንደር-ከብቶች-ገበያውን-ተቆጣጥረውታል&Itemid=180',
                description: '\n\t  \tየወለጋ፣ የሐረርና የቦረና ከብቶች ዘንድሮ ወደ አዲስ አበባ አልገቡምበአቃቂ ለ12 ዓመታት በበሬና በበግ ንግድ ላይ የተሰማሩት አቶ አስቻለው ሽመልስ፤ ከዓምናው የትንሳኤ በዓል ገበያ አንፃር ሲታይ የዘንድሮው በከብቶች ጥራትም ሆነ በዋጋ የተሻለ ነው ይላሉ። ለዚህ ደግሞ ምክንያቱ ዓምና በሬ አምራች በሆኑ…\t  ',
                thumbnailUrl: 'http://www.addisadmassnews.com/media/k2/items/cache/0197ab1cfd761f24d6592262cec139cc_S.jpg',
                type: 'article',
            },
        ],
        [
            {
                title: '“ከዚህ በኋላ በኃይል ተገድጄ ካልሆነ ችሎት አልቀርብም” አቶ በቀለ ገርባ (ቪኦኤ)',
                url: 'http://www.satenaw.com/amharic/archives/32665',
                description: '[jwplayer mediaid=”32667″]ዓቃቤ ሕግ በእነ አቶ በቀለ ገርባ ላይ ያቀረበውን የድምፅ ከምስል ማስረጃ የኢትዮጵያ ብሮድካስቲንግ ኮርፖሬሽን ዛሬም እንዳልተረጎመው አስታወቀ። አቶ በቀለ ገርባ ከዚህ በኋላ በኃይል ተገድጄ ካልሆነ ችሎት አልቀርብም አሉ። አዲስ አበባ — ዓቃቤ ሕግ በእነ አቶ በቀለ ገርባ ላይ ያቀረበውን የድምፅ',
                thumbnailUrl: 'http://www.satenaw.com/amharic/wp-content/uploads/2017/04/Bekele-Gerba-210x140_c.png',
                type: 'article',
            },
        ],
    ];

    it('filterNewPosts fetches unsaved new posts', (done) => {
        app.filterNewPosts(scrapeResults)
            .then((posts) => {
                assert(posts[0] === scrapeResults[0][0]);
                assert(posts[1] === scrapeResults[0][1]);
                assert(posts[2] === scrapeResults[1][0]);
                done();
            });
    });

    function assertFindInDbPosts(dbPosts, postKey) {
        assert(dbPosts.findIndex(dbPost =>
            dbPost._id === postKey) !== 1);
    }

    it('saveSentPosts', (done) => {
        app.filterNewPosts(scrapeResults)
            .then(app.saveSentPosts)
            .then(() => {
                Post.find()
                    .then((dbPosts) => {
                        assertFindInDbPosts(dbPosts, scrapeResults[0][0]);
                        assertFindInDbPosts(dbPosts, scrapeResults[0][1]);
                        assertFindInDbPosts(dbPosts, scrapeResults[1][0]);
                        done();
                    });
            });
    });

    it('save posts and filter against scraped duplicates', (done) => {
        const posts = [
            {
                title: '\n\t  \t\tበፋሲካ በዓል የጎንደር ከብቶች ገበያውን ተቆጣጥረውታል\t  \t',
                url: 'http://www.addisadmassnews.com/index.php?option=com_k2&view=item&id=19999:በፋሲካ-በዓል-የጎንደር-ከብቶች-ገበያውን-ተቆጣጥረውታል&Itemid=180',
                description: '\n\t  \tየወለጋ፣ የሐረርና የቦረና ከብቶች ዘንድሮ ወደ አዲስ አበባ አልገቡምበአቃቂ ለ12 ዓመታት በበሬና በበግ ንግድ ላይ የተሰማሩት አቶ አስቻለው ሽመልስ፤ ከዓምናው የትንሳኤ በዓል ገበያ አንፃር ሲታይ የዘንድሮው በከብቶች ጥራትም ሆነ በዋጋ የተሻለ ነው ይላሉ። ለዚህ ደግሞ ምክንያቱ ዓምና በሬ አምራች በሆኑ…\t  ',
                thumbnailUrl: 'http://www.addisadmassnews.com/media/k2/items/cache/0197ab1cfd761f24d6592262cec139cc_S.jpg',
                type: 'article',
            },
            {
                title: '“ከዚህ በኋላ በኃይል ተገድጄ ካልሆነ ችሎት አልቀርብም” አቶ በቀለ ገርባ (ቪኦኤ)',
                url: 'http://www.satenaw.com/amharic/archives/32665',
                description: '[jwplayer mediaid=”32667″]ዓቃቤ ሕግ በእነ አቶ በቀለ ገርባ ላይ ያቀረበውን የድምፅ ከምስል ማስረጃ የኢትዮጵያ ብሮድካስቲንግ ኮርፖሬሽን ዛሬም እንዳልተረጎመው አስታወቀ። አቶ በቀለ ገርባ ከዚህ በኋላ በኃይል ተገድጄ ካልሆነ ችሎት አልቀርብም አሉ። አዲስ አበባ — ዓቃቤ ሕግ በእነ አቶ በቀለ ገርባ ላይ ያቀረበውን የድምፅ',
                thumbnailUrl: 'http://www.satenaw.com/amharic/wp-content/uploads/2017/04/Bekele-Gerba-210x140_c.png',
                type: 'article',
            },
        ];
        app.saveSentPosts(posts)
            .then(() => app.filterNewPosts(scrapeResults))
            .then((newPosts) => {
                assert(newPosts.length === 1);
                assert(newPosts[0] === scrapeResults[0][0]);
                done();
            });
    });
});
