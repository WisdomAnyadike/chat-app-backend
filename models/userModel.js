const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type :String ,
        required : [true , 'username is required'],
        unique: true
    } , 
    password: {
        type :String ,
        required : [true , 'password is required'] ,
        unique: true
    }
} , {timestamps: true})


const userModel =  mongoose.model('UserSchema' , userSchema )

module.exports = userModel