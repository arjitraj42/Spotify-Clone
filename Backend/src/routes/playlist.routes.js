const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware.authUser, playlistController.createPlaylist);
router.get("/my", authMiddleware.authUser, playlistController.getMyPlaylists);
router.post("/:id/add", authMiddleware.authUser, playlistController.addMusicToPlaylist);
router.post("/:id/remove", authMiddleware.authUser, playlistController.removeMusicFromPlaylist);

module.exports = router;
