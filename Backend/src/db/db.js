const mongoose = require('mongoose')

async function connectDB(){

    try {
        await mongoose.connect(process.env.MONGO_URI)
        
        console.log("database connected sucessfully")

    } catch (error) {
        console.log("database error")
    }
    
    

}

module.exports = connectDB;