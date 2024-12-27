import mongoose, { Mongoose } from "mongoose";

const busrouteSchema = new mongoose.Schema({

    routes : [{
        routeName : {
            type : String,
            required : true
        },
        routeLongitide : {
            type : Number,
            required : true
        },
        routeLatitude : {
            type : String,
            required : true
        }
    }],
    busid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Bus"
    }

},{timestamps : true})

export const Route = mongoose.model("Route",busrouteSchema);