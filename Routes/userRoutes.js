const express = require('express')
const { signUp, login, getUsers, createProfile, addRoleToProfile, getFirstProfile, getAllProfiles, getAllDreams, getProfileWithChosenProfile, setProfileTerms, checkProfileTerms, checkDescription, getFirstProfileTerms, getProfile, uploadProfileDetails } = require('../controller/usercontroller')
const { verifyToken } = require('../middleware/verifyToken')
const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.get('/getUsers', getUsers)
router.post('/createProfile', verifyToken, createProfile)
router.get('/getFirstProfileId', verifyToken, getFirstProfile)
router.post('/addRole/:profileId', verifyToken, addRoleToProfile)
router.get('/getAllProfiles', verifyToken, getAllProfiles)
router.get('/getAllDreams', verifyToken, getAllDreams)
router.get('/checkProfile/:profileId', getProfileWithChosenProfile)
router.get('/setTerms/:profileId/:role', setProfileTerms)
router.get('/checkTerms/:profileId', checkProfileTerms)
router.get('/checkDescription/:profileId', checkDescription)
router.get('/getFirstProfile', verifyToken, getFirstProfileTerms)
router.get('/getProfile/:profileId', verifyToken, getProfile)
router.post('/updateProfile/:profileId', verifyToken, uploadProfileDetails)

module.exports = router

