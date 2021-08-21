var mongoose = require('mongoose');

var likeSchema = new mongoose.Schema({
    bikeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bike'
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    dislikedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: { updatedAt: false } })

module.exports = mongoose.model('Like', likeSchema)