const rp = require('request-promise-native');
const parseString = require('xml2js').parseString;

const SOURCE_ID = 'voa';

const xmlToJSON = xml => new Promise((resolve, reject) => {
  parseString(xml, (err, result) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(result);
  });
});

const getPosts = xml => xmlToJSON(xml)
    .then((rawJson) => {
      const posts = [];
      const { item: items } = rawJson.rss.channel[0];

      items.forEach((item) => {
        posts.push({
          title: item.title[0],
          url: item.link[0],
          description: item.description[0],
          thumbnailUrl: item.enclosure[0].$.url,
          type: 'article',
          sourceId: SOURCE_ID,
        });
      });
      return posts;
    })
    .catch(console.log);

module.exports = () => rp('https://amharic.voanews.com/api/zy--yeqv$y')
  .then(getPosts)
  .catch((error) => { console.log('Error fetching voa\'s feed', error); });
module.exports.SOURCE_ID = SOURCE_ID;
