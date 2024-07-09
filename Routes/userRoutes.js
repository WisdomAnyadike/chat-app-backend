const express = require('express')
const { signUp, login, getUsers, createProfile } = require('../controller/usercontroller')
const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.get('/getUsers', getUsers)
router.post('/createProfile', createProfile)


module.exports = router

