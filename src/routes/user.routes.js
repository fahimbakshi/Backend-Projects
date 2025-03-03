import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; //this comr after route the .post registerUser)
import {upload} from "../middlewares/multer.middleware.js" //taken from middlewares folder


const router = Router()

router.route("/register").post(registerUser) //"resisteruser" is from controllers,& aslo this get call from app.ja file


export default router

