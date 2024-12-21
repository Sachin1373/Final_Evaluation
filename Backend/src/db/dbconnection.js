import mongoose from "mongoose";

const dbconnection = async() => { 
     try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB CONNECTED!!")
     } catch (error) {
        console.log(error.message,"DB NOT CONNECTED")
     }
}

export default dbconnection