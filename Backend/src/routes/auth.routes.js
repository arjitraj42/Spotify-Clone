const express = require("express")
const authcontroller= require("../controllers/auth.controller")

const router = express.Router()

const { registerUser } = require("../controllers/auth.controller")

router.post("/register",authcontroller.registerUser)

router.post("/login",authcontroller.loginUser)

router.post("/login/otp-request", authcontroller.requestOtp)
router.post("/login/otp-verify", authcontroller.verifyOtp)

router.post("/logout", authcontroller.logoutUser)

const authMiddleware = require("../middleware/auth.middleware");
router.get("/me", authMiddleware.authUser, authcontroller.getMe)

module.exports = router