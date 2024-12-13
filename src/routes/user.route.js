import express from "express";
import { userRegister } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        }
    ]),
    userRegister)

export default router