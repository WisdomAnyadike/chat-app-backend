const express = require('express')
const { signUp, login, getUsers, createProfile, addRoleToProfile, getFirstProfile, getAllProfiles } = require('../controller/usercontroller')
const { verifyToken } = require('../middleware/verifyToken')
const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.get('/getUsers', getUsers)
router.post('/createProfile', verifyToken, createProfile)
router.get('/getFirstProfileId', verifyToken, getFirstProfile)
router.post('/addRole/:profileId', verifyToken, addRoleToProfile)
router.get('/getAllProfiles', verifyToken, getAllProfiles)


module.exports = router

