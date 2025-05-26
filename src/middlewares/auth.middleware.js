//this midelware is for logout , it will warify that user is present or not 

import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asynchandler(async(req,_,next) =>{ //if no use of res,req,nrex we can write "_" in that place
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
    
       //if token not exist then error
       if (!token) {
        throw new ApiError(401,"unothorized request");
       }
       
       //if token exist then,check the token is correct or not using JWT and what info is present in that token
       const decodedToken =Jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
       
       const user =await User.findById(decodedToken?._id).select("-password -refreshToken")
       //if user not founf thow error
       if (!user) {
        throw new ApiError(401,"invalid ccess token");
       }
       
       //if shure that we have user,then(we add new object in "req")
       req.user=user;
       next()
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token");
    }

})

