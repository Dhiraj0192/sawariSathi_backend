import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken"; 


const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : [true, "FullName is required!"],

    },
    email : {
        type : String,
        required : [true, "Email is required!"],
        unique : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : [true, "Password is required"],
    },
    avatar : {
        type : String,
        required : [true, "Profile Image is required"]
    },
    refreshToken : {
        type : String
    }

},{timestamps:true})

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.createAccessTocken = function (){
    jsonwebtoken.sign(
        {
            _id : this._id,
            fullName : this.fullName,
            email : this.email,

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXP
        }
    )
}

userSchema.methods.createRefreshTocken = function (){
    jsonwebtoken.sign(
        {
            _id : this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXP
        }
    )
}

export const User = mongoose.model("User", userSchema)