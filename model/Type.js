var mongoose = require('mongoose');

var typeSchema = new mongoose.Schema({
    name: {
        type: 'string',
        minLength: 2,
        required: true,
        unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: { updatedAt: false } })
 
module.exports = mongoose.model('Type', typeSchema)
