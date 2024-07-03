const express = require('express')
const { getRooms } = require('../controller/roomcontroller')
const router2 = express.Router()

router2.get('/:room_id', getRooms)



module.exports = router2