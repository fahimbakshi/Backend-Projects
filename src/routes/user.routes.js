import { Router } from "express";
import {  registerUser } from "../controllers/user.controller.js"; //this comr after route the .post registerUser)
import {upload} from "../middlewares/multer.middleware.js" //taken from middlewares folder


const router = Router()

router.route("/register").post(
    upload.fields([        //this is middelware ,used/writen before "registerUser"
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount: 1
        }
    ]),
    registerUser
) //"resisteruser" is from controllers,& aslo this get call from app.ja file

//rout for login
// router.route("/login").post(loginuser)

// //secure routes
// //if we want to do some operation before run this method,we vant to varify jwt then just wirte "verifywjt"before logoutUser it is the work of middelware
// router.route("/logout").post(varifyJWT,logoutUser)//fater "varifyJWT"(from auth middelware)exicute then "nex()"method which is writen in "auth" middleware get run and "logoutUser" get exicute
    
export default router;

