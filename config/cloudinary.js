const cloudinary = require('cloudinary').v2

const cloudinaryConfig = cloudinary.config({
    cloud_name:process.env.CLOUDNAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

module.exports = {cloudinary , cloudinaryConfig}