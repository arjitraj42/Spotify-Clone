const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/like/music/:id", authMiddleware.authUser, userController.toggleLikeMusic);
router.post("/like/album/:id", authMiddleware.authUser, userController.toggleLikeAlbum);
router.get("/likes", authMiddleware.authUser, userController.getMyLikes);

module.exports = router;
