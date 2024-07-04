const roomModel = require("../models/roomModel")

const getRooms = async (req, res) => {
    const room_id = req.params.room_id
    if (!room_id) {
        res.status(400).send({ message: 'all fields are required' })
    } else {

        try {
            const messages = await roomModel.find({ room_id })
            if (messages) {
                res.status(200).send({ message: 'texts fetched successfully', chats: messages, status: 'okay' })
            } else {
                res.status(400).send({ message: 'couldnt fetch texts', status: false })
            }

        } catch (error) {
            console.log('error while fetching rooms', error);
            res.status(500).send({ message: "internal server error" })
        }

    }



}



const getRoomId = async (req, res) => {
    const { name, user_texted } = req.body
    if (!name || !user_texted) {
        res.status(400).send({ message: "all fields are mandatory" })
    } else {
        try {
            const objWithID = await roomModel.findOne({ name, user_texted })
            if (objWithID) {
                res.status(200).send({ message: "room id gotten successfully", room_id: objWithID.room_id  , status: 'okay'})
            } else {
                res.status(200).send({ message: "couldnt get room id"  , status: 'notokay' , room_id : null})
            }
        } catch (error) {
            console.log('error while fetching roomid', error);
            res.status(500).send({ message: "internal server error"  , status: false })
        }

    }



}


module.exports = { getRooms , getRoomId}