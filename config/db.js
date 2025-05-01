import mongoose from "mongoose";
import { DB_NAME } from "../constants/index.js";


const connToMongo = "mongodb://127.0.0.1:27017";
// process.env.MONGO_URI

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(`${connToMongo}/${DB_NAME}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch(error) {
        console.error(`Error at database connection: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;