const express = require('express')
const { getRooms, getRoomId } = require('../controller/roomcontroller')
const router2 = express.Router()

router2.get('/:room_id', getRooms)
router2.get('/getid', getRoomId)



module.exports = router2