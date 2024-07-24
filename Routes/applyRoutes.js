const express = require('express')
const { verifyToken } = require('../middleware/verifyToken')
const { fetchAllapplications, fetchApplication, acceptProfile, getTeamMembers } = require('../controller/applicationController')
const applyRouter = express.Router()


applyRouter.post('/getapplications', verifyToken, fetchAllapplications)
applyRouter.get('/getapplications/:id', verifyToken, fetchApplication)
applyRouter.post('/acceptApplication', verifyToken, acceptProfile)
applyRouter.post('/getTeam/:dreamId', verifyToken, getTeamMembers)

module.exports = applyRouter