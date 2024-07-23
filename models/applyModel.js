const mongoose = require('mongoose')

const applySchema = new mongoose.Schema({
    dreamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dream',
        required: true
    },
    portfolioUrl: {
        type: String
    },
    coverLetter: {
        type: String
    },
    cvUrl: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSchema',
        required: true
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    }
})

const applyModel = mongoose.model('ApplySchema', applySchema)
module.exports = applyModel