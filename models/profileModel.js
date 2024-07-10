const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profileName: {
        type: String,
        required: true,
        unique:true
    },
    role: {
        roleName: {
            type: String,
            required: true,
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