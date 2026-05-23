const express = require("express")
const authcontroller= require("../controllers/auth.controller")

const router = express.Router()

const { registerUser } = require("../controllers/auth.controller")

router.post("/register",authcontroller.registerUser)

router.post("/login",authcontroller.loginUser)

router.post("/logout", authcontroller.logoutUser)

module.exports = router