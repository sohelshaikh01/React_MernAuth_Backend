import mongoose from "mongoose";
import { DB_NAME } from "../constants/index.js";
import { conf } from "./conf.js"
 
const connToMongo = conf.mongoURI;

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(`mongodb+srv://appTester:appTester123@myapp-cluster.4xumt.mongodb.net/${DB_NAME}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch(error) {
        console.error(`Error at database connection: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;