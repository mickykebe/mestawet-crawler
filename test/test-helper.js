const mongoose = require('mongoose');

before((done) => {
    mongoose.connect('mongodb://localhost/dallol_crawler_test');
    mongoose.connection
        .once('open', () => done())
        .once('error', (error) => {
            console.warn('Error connecting to mongo ', error);
        });
});

beforeEach((done) => {
    const { posts } = mongoose.connection.collections;
    posts.drop()
        .then(() => done())
        .catch(() => done());
});
