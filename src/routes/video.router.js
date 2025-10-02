import { Router } from "express";
import { deleteVideo,updateVideo,getVideoById,publishAVideo,getAllVideos } from "../controllers/video.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateHeaderName } from "http";

const videoRouter = Router();

// Example: public fetch
videoRouter.route("/getAllvideo").get(verifyJWT,getAllVideos);

videoRouter.post(
  "/publish",
  verifyJWT,
  upload.fields([

    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo
);
videoRouter.route("/:videoId").get(verifyJWT,getVideoById);
validateHeaderName    
    .route("/:videoId")
    .patch(upload.single("thumbnail"), updateVideo);

Router.delete("/:videoId", verifyJWT, deleteVideo);
// If you want to protect, just add verifyJWT
// videoRouter.route("/").get(verifyJWT, getAllVideos);

export default videoRouter;
