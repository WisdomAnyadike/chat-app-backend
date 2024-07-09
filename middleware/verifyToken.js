const JWT = require('jsonwebtoken')


const verifyToken = (req, res, next) => {
    const secretKey = process.env.Jwt_SECRET
    const headers = req.headers.authorization || req.headers.authorisation
    if (!headers) {
        res.status(400).send({ message: 'authorization not provided' })
    } else if (!headers.startsWith('Bearer')) {
        res.status(400).send({ message: 'invalid authorization format' })
    } else {
        const token = headers.split(' ')[1]
        if (token) {
            JWT.verify(token, secretKey, (err, decode) => {
                if (err) {
                    res.status(400).send({ message: "Error Verifying Token" });
                } else {
                    console.log('recieved details:', decode.user);
                    req.user = decode.user
                    next()
                }
            })

        }
    }



}



module.exports = {verifyToken}