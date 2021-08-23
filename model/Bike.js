var mongoose = require('mongoose')

var bikeSchema = new mongoose.Schema({
    name: {
        type: 'string',
        minLength: 3,
        required: true
    },
    type: {
        type: 'string',
        minLength: 3,
        required: true
    },
    content: {
        type: 'string',
        minLength: 10,
        required: true
    },
    like: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }

}, { timestamps: true });

module.exports = mongoose.model("bike", bikeSchema);