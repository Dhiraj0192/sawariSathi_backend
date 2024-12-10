import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";


async function dbconnection  (){
    try {
        const dbconnectionInsctance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Database connected on Host : ${dbconnectionInsctance.connection.host}`)
    } catch (error) {
        console.log("Database connection FAILED!! ",error);
        process.exit(1);
        
    }
}

export default dbconnection