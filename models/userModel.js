const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }]
});

const userModel = mongoose.model('UserSchema', userSchema);
module.exports = userModel;

