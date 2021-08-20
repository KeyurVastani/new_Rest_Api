const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
    , password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6
    },
    phone: {
        type: Number,
        require: true,
        trim: true,

    },
}, { timestamps: { updatedAt: false } })


const User = mongoose.model('User', userSchema)

module.exports = User