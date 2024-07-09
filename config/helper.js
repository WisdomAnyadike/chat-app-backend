// const users = []
// const createChat = ({ socket_id, name, user_id, user_texted, room_id }) => {
//     const amountOfUsers = users.length
//     const secondUser = users.findIndex((user) => user.name === user_texted)
//     const exist = users.find((user) => user.socked_id == socket_id && user.room_id === room_id && user.user_id === user_id)
//     if (exist) {
//         return { error: 'user already exists in this room' }
//     } else if (amountOfUsers == 2 && secondUser == -1) {
//         users.splice(secondUser, 1)
//         return { error: 'wrong texter' }
//     } else if (amountOfUsers == 2 || users.find((user) => user.name == name)) {
//         const index = users.findIndex((user) => {
//             return user.name == name && user.room_id === room_id && user.user_id === user_id
//         })
//         const user = { socket_id, name, user_id, user_texted, room_id }
//         users.splice(index, 1, user)
//         return { users }
//     }

//     const user = { socket_id, name, user_id, user_texted, room_id }
//     users.push(user)

//     console.log('user list', users);
//     return { users }
// }


// const removeUser = (socket_id) => {
//     const index = users.findIndex((user) => user.socket_id === socket_id)
//     if (index !== -1) {
//         return users.splice(index, 1)

//     }
// }

// const getUser = (socket_id) => {
//     let user = users.find((user) => user.socket_id === socket_id)
//     return user
// }

// module.exports = { createChat, removeUser, getUser }


const chatModel = require("../models/chatRoomModel");
const roomModel = require("../models/roomModel");

const createChat = async ({ socket_id, name, user_id, user_texted, room_id }) => {
    try {

        const existingUser = await chatModel.findOne({ socket_id, room_id, user_id });
        if (existingUser) {
            console.log('im here exist');
            return { error: 'User already exists in this room' };
        }

        // Check if the number of users in the chat exceeds the limit
        const amountOfUsers = await chatModel.countDocuments();
        const userWithName = await chatModel.findOne({ name });

        if (amountOfUsers == 2 || userWithName) {
            console.log('im here amountof');
            const updatedUser = await chatModel.findOneAndUpdate(
                { user_id, name , room_id},
                { socket_id },
                { new: true }
            );

            if (updatedUser) {
                const users = await chatModel.find();
                console.log('User list:', users);
                return { users };
            }
        }

        console.log('im here last');
        // Add the new user to the chat
        const newUser = await chatModel.create({
            socket_id, name, user_id, user_texted, room_id
        });

        if (newUser) {
            const users = await chatModel.find();
            console.log('User list:', users);
            return { users };
        }


    } catch (error) {
        console.error('Error creating room or adding user:', error);
        return { error: 'Error creating room or adding user: ' + error.message };
    }
};

const removeUser = async (socket_id) => {
    try {
        const removedUser = await chatModel.findOneAndDelete({ socket_id });
        if (removedUser) {
            console.log('User removed:', removedUser);
            const users = await chatModel.find();
            console.log('Users after removal:', users);
            return removedUser;
        } else {
            console.log('User not found for removal');
            return null;
        }
    } catch (error) {
        console.error('Error removing user:', error);
        return { error: 'Error removing user: ' + error.message };
    }
};

const getUser = async (socket_id) => {
    try {
        const user = await chatModel.findOne({ socket_id });
        console.log('Get user:', user);
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        return { error: 'Error getting user: ' + error.message };
    }
};

module.exports = { createChat, removeUser, getUser };
