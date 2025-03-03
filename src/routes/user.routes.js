import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; //this comr after route the .post registerUser)

const router = Router()

router.route("/register").post(registerUser) //"resisteruser" is from controllers,& aslo this get call from app.ja file


export default router

