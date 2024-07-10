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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    }
});

// function rolesLimit(val) {
//     const roleCount = val.reduce((acc, role) => {
//         acc[role.ideaId] = (acc[role.ideaId] || 0) + 1;
//         return acc;
//     }, {});
//     return !Object.values(roleCount).some(count => count > 2);
// }

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
