const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSchema',
        required: true
    },
    profileName: {
        type: String,
        required: true,
        unique: true
    },
    setAcceptTerms: {
        type: Boolean,
        default: false
    },
    setChooseProfile: {
        type: Boolean,
        default: false
    },
    ChooseWorker: {
        type: Boolean,
        default: false
    },
    setRoleDescription: {
        type: Boolean,
        default: false
    },
    portfolioUrl: { type: String },
    coverLetter: { type: String },
    cvUrl: { type: String },
    isProfileSet: {
        type: Boolean,
        default: false
    },
    isAccepted: {
        type: Boolean,
        default: false
    }
    ,
    role: {
        roleName: {
            type: String,
            enum: ['Concept Innovator', 'Investor' , 'Frontend Developer', 'Backend Developer', 'Product Manager', 'UI/UX Designer', 'Data Scientist', 'QA Engineer', 'Marketing Specialist']
        },
        dreamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dream'
        }
    }
});



const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;



