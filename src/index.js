import dotenv from "dotenv";
dotenv.config({path:"./.env"});

import app from "./app.js";
import dbconnection from "./db/dbconnection.js";


dbconnection()
.then(app.listen(process.env.PORT,()=>{
    console.log(`Server is started on port : ${process.env.PORT}`);

})).catch((err)=>{
    console.log("Server failed to start !!");
    
})