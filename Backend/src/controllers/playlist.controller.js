const playlistModel = require("../models/playlist.model");

async function createPlaylist(req, res) {
    try {
        const { title, music } = req.body;
        const ownerId = req.user._id || req.user.id;

        const playlist = await playlistModel.create({
            title,
            owner: ownerId,
            music: music || []
        });

        res.status(201).json({ message: "Playlist created successfully", playlist });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getMyPlaylists(req, res) {
    try {
        const ownerId = req.user._id || req.user.id;
        const playlists = await playlistModel.find({ owner: ownerId }).populate({
            path: "music",
            populate: { path: "artist", select: "username" }
        });
        
        res.status(200).json({ playlists });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function addMusicToPlaylist(req, res) {
    try {
        const { musicId } = req.body;
        const playlistId = req.params.id;
        const ownerId = req.user._id || req.user.id;

        const playlist = await playlistModel.findOne({ _id: playlistId, owner: ownerId });
        if (!playlist) return res.status(404).json({ message: "Playlist not found or unauthorized" });

        if (!playlist.music.includes(musicId)) {
            playlist.music.push(musicId);
            await playlist.save();
        }

        res.status(200).json({ message: "Music added to playlist", playlist });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function removeMusicFromPlaylist(req, res) {
    try {
        const { musicId } = req.body;
        const playlistId = req.params.id;
        const ownerId = req.user._id || req.user.id;

        const playlist = await playlistModel.findOne({ _id: playlistId, owner: ownerId });
        if (!playlist) return res.status(404).json({ message: "Playlist not found or unauthorized" });

        const index = playlist.music.indexOf(musicId);
        if (index > -1) {
            playlist.music.splice(index, 1);
            await playlist.save();
        }

        res.status(200).json({ message: "Music removed from playlist", playlist });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { createPlaylist, getMyPlaylists, addMusicToPlaylist, removeMusicFromPlaylist };
