const userModel = require("../models/user.model.js")
const jsonwebtoken = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

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
    id : user.id,
    role : user.role,
},process.env.JWT_SECRET)

res.cookie("token",token)

res.status(200).json({
    message : "user logged in succesfully",
    user: {
        id : user.id,
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




module.exports = { registerUser,loginUser, logoutUser}