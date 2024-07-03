const express = require('express')
const { signUp, login, getUsers } = require('../controller/usercontroller')
const router = express.Router()

router.post( '/signup' , signUp)
router.post( '/login' , login)
router.get( '/getUsers' , getUsers)


module.exports = router

