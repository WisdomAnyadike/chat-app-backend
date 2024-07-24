const applyModel = require("../models/applyModel")
const Dream = require("../models/dreamModel")
const Profile = require("../models/profileModel")

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



const acceptProfile = async (req, res) => {
    const user = req.user;
    const { profileId, dreamId, userId, role } = req.body;

    if (!user) {
        return res.status(400).send({ message: 'authorisation not provided' });
    }

    if (!profileId) {
        return res.status(400).send({ message: 'profile id is required' });
    }

    try {
        const appliedDream = await Dream.findById(dreamId);
        if (!appliedDream) {
            return res.status(404).send({ message: 'applied dream not found' });
        }

        const dreamer = {
            userId,
            profileId,
            role
        };

        appliedDream.dreamMembers.push(dreamer);
        const updatedDream = await appliedDream.save();

        if (!updatedDream) {
            return res.status(400).send({ message: 'an error occurred while adding user to dream', status: false });
        }

        const userProfile = await Profile.findByIdAndUpdate(profileId, { isAccepted: true }, { new: true });

        const applications = await applyModel.find({ profileId });
        for (const app of applications) {
            app.isAccepted = true;
            await app.save();
        }

        if (userProfile && applications.length > 0) {
            return res.status(200).send({ message: 'user accepted successfully', status: "okay" });
        } else {
            return res.status(400).send({ message: 'an error occurred while accepting profile', status: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Server error', error });
    }
};


module.exports = { fetchAllapplications, fetchApplication, acceptProfile }