const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const jsonwebtoken = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");

async function createMusic(req, res) {

    
        const { title } = req.body;

        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "Music file is required"
            });
        }

        const result = await uploadFile(
            file.buffer.toString("base64")
        );

        const artistId = req.user._id || req.user.id;

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: artistId,
        });

        res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist,
            }
        });

}

async function createAlbum(req, res) {

    
        const { title, music} = req.body;
        const artistId = req.user._id || req.user.id;

        const album = await albumModel.create({
            title,
            artist: artistId,
            music: music,
        });

        res.status(201).json({
            message: "Album created successfully",
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                music: album.music
            }
        });

    
}


async function getallmusic(req, res) {
    const music = await musicModel
    .find()
    // .skip(4)
    // .limit(2)
    .populate("artist", "username email")

    res.status(200).json({
        message : "music fetched succesfully",
        music : music
    })
    
}


async function getAlbum(req, res) {

    const albums = await albumModel
        .find().select("title artist")
        .populate("artist", "username email");

    res.status(200).json({
        message: "Albums fetched successfully",
        albums: albums,
    });

}


async function getAlbumById(req, res) {

    const albumId = req.params.albumId;

    const album = await albumModel
        .findById(albumId)
        .populate("artist", "username email")
        .populate("music");

    if (!album) {
        return res.status(404).json({
            message: "Album not found"
        });
    }

    return res.status(200).json({
        message: "Album fetched successfully",
        album: album,
    });
}

module.exports = {createMusic,createAlbum, getallmusic, getAlbum, getAlbumById};