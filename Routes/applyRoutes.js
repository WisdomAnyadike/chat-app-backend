const express = require('express')
const { verifyToken } = require('../middleware/verifyToken')
const { fetchAllapplications } = require('../controller/applicationController')
const applyRouter = express.Router()


applyRouter.post('/getapplications', verifyToken, fetchAllapplications)

module.exports = applyRouter