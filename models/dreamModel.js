const mongoose = require('mongoose');

const dreamMemberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User.profiles',
        required: true
    },
    role: {
        type: String ,
        required: true
    }
});

const dreamSchema = new mongoose.Schema({
    dreamName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dreamMembers: {
        type: [dreamMemberSchema],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Dream = mongoose.model('Dream', dreamSchema);
module.exports = Dream;
