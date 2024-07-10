const express = require('express')
const { signUp, login, getUsers, createProfile, addRoleToProfile, getFirstProfile } = require('../controller/usercontroller')
const { verifyToken } = require('../middleware/verifyToken')
const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.get('/getUsers', getUsers)
router.post('/createProfile', verifyToken, createProfile)
router.get('/getFirstProfileId', verifyToken, getFirstProfile)
router.post('/addRole:profileId', verifyToken, addRoleToProfile)


module.exports = router

