var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    comment: {
        type: 'string',
        minLength: 5,
        required: true
    },
    bikeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bike'
    },
    CommentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'

    }
}, { timestamps: { updatedAt: false } });

module.exports = mongoose.model('Comment', commentSchema);