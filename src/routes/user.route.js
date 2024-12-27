import express from "express";
import { userRegister,userLogin } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import {addBusDetails,renderAddBusForm,getBusRoutes} from "../controllers/bus.controller.js";

const router = express.Router();

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        }
    ]),
    userRegister);

router.route("/addbus").get(renderAddBusForm).post(
    upload.fields([
        {
            name : "busPhoto",
            maxCount : 1
        }
    ]),
    addBusDetails);
router.route("/login").post(
    upload.fields([
        {
            name : "busPhoto",
            maxCount : 1
        }
    ]),
    userLogin)

router.route("/getbus").post(
    upload.fields([
        {
            name : "busPhoto",
            maxCount : 1
        }
    ]),
    getBusRoutes)

export default router