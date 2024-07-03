const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    }, 
     user_id: {
        type: String,
        required:true
    } ,
    room_id: {
        type: String,
        required:true
    } ,
    user_texted: {
        type: String,
        required:true
    } , 
    message: {
        type: String,
        required:true 
    }
} , {timestamps:true})



const roomModel = mongoose.model("RoomSchema" , roomSchema)

module.exports = roomModel