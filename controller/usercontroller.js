const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs')


const signUp = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(400).send({ message: "all fields are mandatory" })
    } else {
        try {
            const validateUser = await userModel.findOne({ username })

            if (validateUser) {
                res.status(400).send({ message: "user already exists" })
                return
            }
            const hashPassword = await bcrypt.hash(password, 10)
            const createUser = await userModel.create({
                username, password: hashPassword
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
                if (!comparePassword) {
                    res.status(400).send({ message: "password does not match" , status:false })
                } else {
                    res.status(200).send({ message: "login successful" , status:'okay' , user: {name: validateUser.username , id: validateUser.id}  })
                }

            }

        } catch (error) {
            console.log('error while loggin in', error);
            res.status(500).send({ message: "internal server error"  , status: false})
        }




    }


}

let getUsers = async(req, res)=> {
   try {
    const users = await userModel.find()
    if(!users || users.length === 0){
        res.status(400).send({ message: "couldnt get users"  , status:false})
    }else{
        const userArr = users.map((user)=> {
            return {
                name: user.username ,
                id: user._id
             }
        })  
        res.status(200).send({ message: "users fetched successfully" , chatUsers: userArr , status:'okay' })
    }
    
   } catch (error) {
       console.log('error while fetching users', error);
            res.status(500).send({ message: "internal server error" })
   }
}




module.exports = {signUp , login , getUsers}