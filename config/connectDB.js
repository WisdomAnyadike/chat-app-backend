const mongoose = require('mongoose')

const ConnectDb = async() => {
    const connectionString = process.env.Connection_String
    try {
        const connecter = await mongoose.connect(connectionString)
        if (connecter) {
            console.log('database connected');
        }else {
            console.log('couldnt connect to database ');
        }
        
    } catch (error) {
        console.log('network error' , error);
    }

}

module.exports = ConnectDb