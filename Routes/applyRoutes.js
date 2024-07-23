const express = require('express')
const { verifyToken } = require('../middleware/verifyToken')
const { fetchAllapplications, fetchApplication } = require('../controller/applicationController')
const applyRouter = express.Router()


applyRouter.post('/getapplications', verifyToken, fetchAllapplications)
applyRouter.get('/getapplications/:id', verifyToken, fetchApplication)

module.exports = applyRouter