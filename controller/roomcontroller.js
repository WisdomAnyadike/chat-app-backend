const roomModel = require("../models/roomModel")

const getRooms = async (req, res) => {
    const room_id  = req.params.room_id
    if (!room_id) {
        res.status(400).send({ message: 'all fields are required' })
    } else {

        try {
            const messages = await roomModel.find({ room_id })
            if (messages) {
                res.status(200).send({ message: 'texts fetched successfully', chats: messages , status:'okay' })
            } else {
                res.status(400).send({ message: 'couldnt fetch texts' , status: false })
            }

        } catch (error) {
            console.log('error while fetching users', error);
            res.status(500).send({ message: "internal server error" })
        }

    }



}


module.exports = {getRooms}