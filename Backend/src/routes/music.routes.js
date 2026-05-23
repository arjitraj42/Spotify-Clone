const express = require("express");
const musicController = require("../controllers/music.controller");
const authMiddleware= require("../middleware/auth.middleware")
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage()
});

const router = express.Router();

router.post(
    "/upload",
    upload.single("music"), authMiddleware.authArtist,musicController.createMusic
);

router.post("/album", authMiddleware.authArtist,  musicController.createAlbum);

router.get("/", authMiddleware.authUser,  musicController.getallmusic) 

router.get("/album", authMiddleware.authUser, musicController.getAlbum)

router.get("/album/:albumId", authMiddleware.authUser, musicController.getAlbumById)
module.exports = router;