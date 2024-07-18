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
    role: {
        roleName: {
            type: String,
            enum: ['Concept Innovator', 'Frontend Developer', 'Backend Developer', 'Product Manager', 'UI/UX Designer', 'Data Scientist', 'QA Engineer', 'Marketing Specialist']
        },
        dreamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dream'
        }
    }
});



const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;



// function rolesLimit(val) {
//     const roleCount = val.reduce((acc, role) => {
//         acc[role.ideaId] = (acc[role.ideaId] || 0) + 1;
//         return acc;
//     }, {});
//     return !Object.values(roleCount).some(count => count > 2);
// }