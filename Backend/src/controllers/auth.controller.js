const userModel = require("../models/user.model.js")
const jsonwebtoken = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utils/sendEmail")

async function registerUser(req, res) {
        const { username, email, password, role = "user" } = req.body

        const isUserAlreadyExist = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if (isUserAlreadyExist) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        const hash = await bcrypt.hash(password,10)

        const user = await userModel.create({
            username,
            email,
            password : hash,
            role
        })

        const token = jsonwebtoken.sign(
            {
                _id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET
        )

        res.cookie("token", token)

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
  
}

async function loginUser(req,res) {
    const {username, email, password} = req.body;

    const user = await userModel.findOne({
    $or :[
        {username},
        {email}
    ]
})

if (!user){return res.status(401).json({message : "invalid credential"})}

const isPasswordVaild  = await bcrypt.compare(password, user.password)

if(!isPasswordVaild){ return res.status(401).json({message : "Invalid Credential"})}

const token = jsonwebtoken.sign({
    _id : user._id,
    role : user.role,
},process.env.JWT_SECRET)

res.cookie("token",token)

res.status(200).json({
    message : "user logged in succesfully",
    user: {
        _id : user._id,
        username : user.username,
        email : user.email,
        role : user.role
    }
})

}


async function logoutUser(req, res) {
    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}

async function getMe(req, res) {
    try {
        const userId = req.user._id || req.user.id;
        const user = await userModel.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports.requestOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "artist") {
            return res.status(403).json({ message: "Only creators can login with OTP" });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Expiry 5 minutes
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        console.log(`\n=========================================`);
        console.log(`[OTP GENERATED FOR ${email}]`);
        console.log(`Your OTP is: ${otp}`);
        console.log(`=========================================\n`);

        await sendEmail({
            email: user.email,
            subject: "Your Creator Login OTP",
            message: `Your login OTP is ${otp}. It is valid for 5 minutes.`
        });

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Clear OTP
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { registerUser, loginUser, logoutUser, getMe, requestOtp: module.exports.requestOtp, verifyOtp: module.exports.verifyOtp }