const applyModel = require("../models/applyModel")

const fetchAllapplications = async (req, res) => {
    const user = req.user
    const { dreamId } = req.body
    if (!user) {
        res.status(400).send({ message: 'no authentication provided', status: false })
    } else {
        try {
            const applications = await applyModel.find({ dreamId }).populate('userId', 'username').populate({
                path: 'profileId',
                select: 'role.roleName'
            })
            if (applications && applications.length !== 0) {
                res.status(200).send({ message: 'application fetched successfully', status: 'okay', applications })
            } else if (applications.length == 0) {
                res.status(404).send({ message: 'no applications', status: false })
            } else {
                res.status(400).send({ message: 'couldnt fetch applications', status: false })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Server error', error });
        }
    }

}


const fetchApplication = async (req, res) => {
    const user = req.user
    const { id } = req.params
    if (!user) {
        res.status(400).send({ message: 'no authentication provided', status: false })
    } else {
        try {
            const application = await applyModel.findById(id).populate('userId', 'username').populate({
                path: 'profileId',
                select: 'role.roleName'
            })
            if (application) {
                res.status(200).send({ message: 'application fetched successfully', status: 'okay', application })
            } else {
                res.status(400).send({ message: 'couldnt fetch applications', status: false })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Server error', error });

        }
    }

}

module.exports = { fetchAllapplications, fetchApplication }