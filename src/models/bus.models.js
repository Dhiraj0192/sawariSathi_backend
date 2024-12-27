import mongoose from "mongoose";

const busSchema = new mongoose.Schema({

    busName : {
        type : String,
        required : true
    },
    totalBuses : {
        type : Number,
        required : true,
        default : 1
    },
    busType : {
        type : String,
        required : true,
        enum : ["Mini Bus", "Micro Bus", "Tempo"]

    },
    startingTime : {
        type : String,
        required : true
    },
    closingTime : {
        type : String,
        required : true
    },
    busPhoto : {
        type : String,
        
    }


},{timestamps : true})

export const Bus = mongoose.model("Bus",busSchema);
