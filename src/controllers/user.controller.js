
import {asynchandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.models.js";
import {CloudinaryUpload} from "../utils/Cloudinary.js";

const userRegister = asynchandler( async (req,res)=>{
    // get data from req.body
    // validate data : empty or not
    // check user exist or not
    // get image data : req.files
    // validate image data : upload on localpath or not
    // upload image on cloudinary
    // ckeck upload successfully or not
    // create user 
    // check user created or not also remove "password and refreshToken from object"
    // return object

    console.log(req.body);

    const {fullName, email, password} = req.body;
    if ([fullName,email,password].some((field)=>field?.trim() === "")) {
        throw new ApiError(400,"All Fields are required !!");
    }

    const alredyRegister = await User.findOne({email});
    if (alredyRegister) {
        throw new ApiError(409, "User with this email is already registered !!");
    }

    const avatarLoacalFilePath = req.files?.avatar[0]?.path;
    if (!avatarLoacalFilePath) throw new ApiError(400, "Avatar Image is required !!");

    const avatarUpload = await CloudinaryUpload(avatarLoacalFilePath);
    if (!avatarUpload) throw new ApiError(403, "Somthing went wrong while uploading image");

    const user = await User.create({
        fullName,
        email,
        password,
        avatar : avatarUpload.url
    });

    const createdUser = await User.findById(user._id).select("-refreshToken -password");
    
    if (!createdUser) throw new ApiError(500, "Somthing went wrong while creating user object !!");

    return res.status(201).json(
        new ApiResponse(
            200,
            createdUser,
            "User Successfully Registered !!"
        )
    );


})

const userLogin = asynchandler( async (req,res) => {
    // get data from req.body
    // validate date : empty of not
    // find user
    // check password is correct or not
    // generate accessToken and refreshToken
    // set refreshToken in user collection
    // remove password and refreshtoken from user object
    // send tokens in cookie
    // return user with response

    

    const {email,password} = req.body;
    
    if ([email,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required !!");
    }

    const user = await User.findOne({email});

    if (!user) throw new ApiError(404,"User not registered with this crenditials !!");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(409,"Invalid user crenditials");

    const accessToken = await user.createAccessTocken;
    const refreshToken = await user.createRefreshTocken;

    if(!accessToken || !refreshToken) throw new ApiError(500, "Somthing went wrong while creating access token and refresh token");

    user.refreshToken = refreshToken;
    await user.save();

    const logedInUserer = await user.select("-pasword -refreshToken");

    const option = {
        httpOnly : true,
        secure : true
    }

    return res.status(201).cookie("AccessToken",accessToken,option).cookie("RefreshToken",refreshToken,option).json(new ApiResponse(
        200,
        {
            user : accessToken,refreshToken,logedInUserer
        },
        "User Successfully LogedIn !!"
    ));


})

export {userRegister,userLogin}