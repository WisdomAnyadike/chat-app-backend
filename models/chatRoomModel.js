const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    socket_id: {
        type:String,
        required:true
    }, 
    name: {
        type: String,
        required:true
    },
    user_id: {
        type: String,
        required:true
    },
    user_texted: {
        type: String,
        required:true
    },
    room_id: {
        type: String,
        required:true
    }
})



const chatModel = mongoose.model("ChatSchema" , ChatSchema)

module.exports = chatModel