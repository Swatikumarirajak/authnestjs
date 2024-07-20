import mongoose from "mongoose";


export async function connect() {
    try {
        mongoose.connect(process.env.MONGODB_URL!)
        const connection = mongoose.connection
        connection.on('connected',()=>{
            console.log('MongoDB connected');
        })

        connection.on('error',(err)=>{
            console.log('MongoDB connection error please make sure db is up and running:' +err);
            process.exit()
        })
    } catch (error) {
        console.log('Something went wrong in connecting to db');
        console.log(error);
    }
}