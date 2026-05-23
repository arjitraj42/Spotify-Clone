const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    music: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "music"
    }]
});

const playlistModel = mongoose.model("playlist", playlistSchema);

module.exports = playlistModel;
