import { Router } from "express";
import { getAllVideos } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const videoRouter = Router();

// Example: public fetch
videoRouter.route("/getAllvideo").get(verifyJWT,getAllVideos);

// If you want to protect, just add verifyJWT
// videoRouter.route("/").get(verifyJWT, getAllVideos);

export default videoRouter;
