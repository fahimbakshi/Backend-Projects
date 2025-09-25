import { Router } from "express";
import {  registerUser ,loginuser ,logoutUser,refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetail, updateUserAvatar, updateUserCoverimage, getuserchannelprofile, getWatchHistory} from "../controllers/user.controller.js"; //this comr after route the .post registerUser)
import {upload} from "../middlewares/multer.middleware.js" //taken from middlewares folder
import { verifyJWT } from "../middlewares/auth.middleware.js";

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
router.route("/login").post(loginuser);

// //secure routes
// //if we want to do some operation before run this method,we vant to varify jwt then just wirte "verifywjt"before logoutUser it is the work of middelware
router.route("/logout").post(verifyJWT,logoutUser);//fater "varifyJWT"(from auth middelware)exicute then "nex()"method which is writen in "auth" middleware get run and "logoutUser" get exicute
router.route("/refresh-token.").post(refreshAccessToken);
router.route("/changePassword").post(verifyJWT,changeCurrentPassword);
router.route("/current user").get(verifyJWT,getCurrentUser);
router.route("/updateaccoutn").patch(verifyJWT,updateAccountDetail);

//updating avatar taking single file
router.route("/updateAvatar").patch(verifyJWT, upload.single("avatar"),updateUserAvatar);
router.route("/updateCOnerimage").patch(verifyJWT,upload.single("coverImage"),updateUserCoverimage);

//we are taking this router form params
router.route("/getUserChannel/:username").get(verifyJWT,getuserchannelprofile);

router.route("/userWatchHistory").get(verifyJWT,getWatchHistory);

export default router;

