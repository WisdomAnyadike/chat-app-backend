const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const Dream = require("../models/dreamModel")
const Profile = require("../models/profileModel")


const signUp = async (req, res) => {
    const { username, password, email } = req.body
    if (!username || !password || !email) {
        res.status(400).send({ message: "all fields are mandatory" })
    } else {
        try {
            const validateUser = await userModel.findOne({ username })
            const validateEmail = await userModel.findOne({ email })

            if (validateUser || validateEmail) {
                res.status(400).send({ message: "user already exists" })
                return
            }
            const hashPassword = await bcrypt.hash(password, 10)
            const createUser = await userModel.create({
                username, email, password: hashPassword
            })

            if (createUser) {
                res.status(200).send({ message: "user created successfully" })
            } else {
                res.status(400).send({ message: "couldnt created user successfully" })
            }


        } catch (error) {
            console.log('error while signing up', error);
            res.status(500).send({ message: "internal server error" })
        }

    }

}


const login = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(400).send({ message: "all fields are mandatory" })
    } else {
        try {

            const validateUser = await userModel.findOne({ username })
            if (!validateUser) {
                res.status(400).send({ message: "user does not exist , try signing up" })
            } else {
                const comparePassword = await bcrypt.compare(password, validateUser.password)
                const secretKey = process.env.Jwt_SECRET

                const token = JWT.sign({
                    user: {
                        username: validateUser.username,
                        email: validateUser.email,
                        userId: validateUser._id
                    }

                }, secretKey, { expiresIn: '1d' })

                if (!comparePassword) {
                    res.status(400).send({ message: "password does not match", status: false })
                } else {
                    res.status(200).send({ message: "login successful", status: 'okay', token, user: { name: validateUser.username, id: validateUser.id } })
                }

            }

        } catch (error) {
            console.log('error while loggin in', error);
            res.status(500).send({ message: "internal server error", status: false })
        }




    }


}

let getUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        if (!users || users.length === 0) {
            res.status(400).send({ message: "couldnt get users", status: false })
        } else {
            const userArr = users.map((user) => {
                return {
                    name: user.username,
                    id: user._id
                }
            })
            res.status(200).send({ message: "users fetched successfully", chatUsers: userArr, status: 'okay' })
        }

    } catch (error) {
        console.log('error while fetching users', error);
        res.status(500).send({ message: "internal server error" })
    }
}


const createProfile = async (req, res) => {
    const { userId } = req.user
    const { profileName } = req.body;
    if (!profileName) {
        res.status(400).send({ message: 'profile name is mandatory' })
    } else {
        try {
            // Find user
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            const verifyProfile = await Profile.findOne({ profileName })

            if (!verifyProfile) {
                const profile = await Profile.create({
                    userId,
                    profileName,
                    setChooseProfile: true
                })

                // Add new profile
                if (profile) {
                    user.profiles.push(profile._id);
                    await user.save();

                    res.status(201).send({ message: 'Profile created successfully', profileId: profile._id, status: 'okay' });
                }
            } else {
                res.status(400).send({ message: 'profile already exists' });

            }



        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Server error' + error, status: false });
        }

    }

};



const addRoleToProfile = async (req, res) => {
    const { profileId } = req.params;
    const { userId } = req.user
    const { roleName, dreamId, dreamName, description, } = req.body;

    if (!profileId) {
        res.status(400).send({ message: 'profile id is mandatory' })
    } else if (!userId) {
        res.status(400).send({ message: 'authentication not provided' })
    } else if (!roleName) {
        res.status(400).send({ message: 'rolename is mandatory' })
    } else if (roleName === 'Concept Innovator' && (!dreamName || !description)) {
        res.status(400).send({ message: 'Innovator role requires dreamname & description' })
    } else {

        try {
            // Find user
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            // Find profile
            const profile = await Profile.findById(profileId);
            if (!profile) {
                return res.status(404).send({ message: 'Profile not found', status: false });
            }


            let newDreamId = dreamId;

            // Create dream if the role is Concept Innovator
            if (roleName === 'Concept Innovator') {
                const newDream = await Dream.create({
                    dreamName,
                    description,
                    createdBy: userId
                });
                if (newDream) {
                    newDreamId = newDream._id;
                } else {
                    return res.status(400).send({ message: 'couldnt create new dream', status: false })
                }

            }

            // Add role to profile
            if (newDreamId) {
                console.log('i happened');
                const updateProfile = await Profile.findByIdAndUpdate(profileId, {
                    role: { roleName, dreamId: newDreamId }
                }, { new: true })

                if (updateProfile) {
                    return res.status(200).send({ message: 'Role added successfully', updateProfile, status: 'okay' });
                } else {
                    return res.status(400).send({ message: 'couldnt update profile role', status: false })
                }

            } else {
                console.log('2nd happened');
                const updateProfile = await Profile.findByIdAndUpdate(profileId, {
                    role: { roleName, dreamId: null }
                }, { new: true })

                if (updateProfile) {
                    return res.status(200).send({ message: 'Role add without dream id successfully', updateProfile, status: 'okay' });
                } else {
                    return res.status(400).send({ message: 'couldnt update profile role', status: false })
                }

            }

        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: 'Server error', error });

        }
    }

};

const removeRoleFromProfile = async (req, res) => {
    try {
        const { userId, profileId, roleId } = req.params;

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Find profile
        const profile = user.profiles.id(profileId);
        if (!profile) {
            return res.status(404).send({ message: 'Profile not found' });
        }

        // Remove role from profile
        profile.roles.id(roleId).remove();
        await user.save();

        res.status(200).send({ message: 'Role removed successfully', profile });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};



const getFirstProfile = async (req, res) => {
    const { userId } = req.user
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const profiles = await Profile.find({ userId })
        if (!profiles) {
            res.status(400).send({ message: 'couldnt get profile', status: false });
        } else {
            res.status(200).send({ message: 'profile id fetched', status: 'okay', profileId: profiles[0]._id });
        }
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }

}

const getAllProfiles = async (req, res) => {
    const { userId } = req.user
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const profiles = await Profile.find({ userId })
        if (!profiles) {
            res.status(400).send({ message: 'couldnt get profile', status: false });
        } else {
            res.status(200).send({ message: 'profile gotten successfully', status: 'okay', profiles });
        }
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }

}


const getAllDreams = async (req, res) => {
    const { userId } = req.user
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const dreams = await Dream.find().populate('createdBy', 'username');
        if (!dreams) {
            res.status(400).send({ message: 'couldnt get dreams', status: false });
        } else {
            res.status(200).send({ message: 'dreams gotten successfully', status: 'okay', dreams });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error', error });
    }

}


const getProfileWithChosenProfile = async (req, res) => {
    const { profileId } = req.params;
    if (!profileId) {
        return res.status(400).send({ message: 'Profile ID is required' });
    }

    try {
        // Find the specific profile by ID and check if setChooseProfile is true
        const profile = await Profile.findOne({ _id: profileId, setChooseProfile: true }).populate('userId', 'username');

        if (!profile) {
            return res.status(404).send({ message: 'Profile not found or setChooseProfile is not true', status: false });
        }

        res.status(200).send({ message: 'Profile retrieved successfully', status: true, profile });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error', error });
    }
};






module.exports = {
    signUp, login, getUsers,
    createProfile,
    addRoleToProfile,
    removeRoleFromProfile,
    getFirstProfile,
    getAllProfiles,
    getAllDreams,
    getProfileWithChosenProfile
};
