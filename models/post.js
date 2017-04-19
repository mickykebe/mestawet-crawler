const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
});

const Post = mongoose.model('post', PostSchema);

module.exports = Post;
