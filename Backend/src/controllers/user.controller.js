const userModel = require("../models/user.model");

async function toggleLikeMusic(req, res) {
    try {
        const userId = req.user._id || req.user.id;
        const musicId = req.params.id;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const index = user.likedMusic.indexOf(musicId);
        if (index === -1) {
            user.likedMusic.push(musicId);
        } else {
            user.likedMusic.splice(index, 1);
        }

        await user.save();
        res.status(200).json({ message: "Like toggled", likedMusic: user.likedMusic });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function toggleLikeAlbum(req, res) {
    try {
        const userId = req.user._id || req.user.id;
        const albumId = req.params.id;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const index = user.likedAlbums.indexOf(albumId);
        if (index === -1) {
            user.likedAlbums.push(albumId);
        } else {
            user.likedAlbums.splice(index, 1);
        }

        await user.save();
        res.status(200).json({ message: "Like toggled", likedAlbums: user.likedAlbums });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getMyLikes(req, res) {
    try {
        const userId = req.user._id || req.user.id;
        const user = await userModel.findById(userId)
            .populate("likedMusic")
            .populate("likedAlbums");
            
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            likedMusic: user.likedMusic,
            likedAlbums: user.likedAlbums
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { toggleLikeMusic, toggleLikeAlbum, getMyLikes };
