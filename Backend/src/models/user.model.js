const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    username: {
        required: true,
        type: String,
        unique: true
    },

    email: {
        required: true,
        type: String,
        unique: true
    },

    password: {
        required: true,
        type: String
    },

    role: {
        type: String,
        enum: ["user", "artist"],
        default: "user"
    },

    otp: {
        type: String,
        default: null
    },
    
    otpExpiry: {
        type: Date,
        default: null
    },

    likedMusic: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "music"
    }],

    likedAlbums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "album"
    }]

})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel