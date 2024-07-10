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
                    profileName
                })

                // Add new profile
                if (profile) {
                    user.profiles.push(profile._id);
                    await user.save();

                    res.status(201).send({ message: 'Profile created successfully', profiles: user.profiles, status: 'okay' });
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
    } else if (roleName !== 'Concept Innovator' && !dreamId) {
        res.status(400).send({ message: 'Non-Innovator role requires dreamId' })
    } else {

        try {
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
                    res.status(400).send({ message: 'couldnt create new dream' })
                }

            }

            // Add role to profile
            if (newDreamId) {
                profile.roles.push({ roleName, dreamId: newDreamId });
                await user.save();
            }


            res.status(201).send({ message: 'Role added successfully', profile });
        } catch (error) {
            res.status(500).send({ message: 'Server error', error });
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

const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({ user });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};

const updateUserInformation = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, password } = req.body;

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Update user information
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();

        res.status(200).send({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find and delete user
        await User.findByIdAndDelete(userId);

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
};


const getProfile = async (req, res) => {

}






module.exports = {
    signUp, login, getUsers,
    createProfile,
    addRoleToProfile,
    removeRoleFromProfile,
    getUserDetails,
    updateUserInformation,
    deleteUser
};
