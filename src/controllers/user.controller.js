import { asynchandler } from "../utils/asynchandler.js"; //we taken the asynchandler.js filr from utils folder
import {ApiError} from  "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import{uploadOnCloudnary} from "../utils/cloudnary.js"
import{ApiResponse} from "../utils/ApiResponse.js"; //to return response at the end  
import jwt from "jsonwebtoken"

//demo code:-

// const registerUser = asynchandler(async(req,res) =>{
//     console.log("error");
    
//     res.status(200).json({
//         message:"ok"
//     })
// })

const generateAccessAndRefereshTokens = async(userId)=>  //we gate userId from user (we have access of "user",code writen down)
   { 
    try {
       const user = await User.findById(userId) //now we have user document using this 
       //we gate access and refersh token from "user.model.js"
       const accessToken =user.generateAccessToken()
       const refreshToken =user.generateRefreshToken()

      //adding values in objesct
      user.refreshToken =refreshToken
      await user.save({ validateBeforeSave:false }) //save the vale in object//save in database 
      
      return{accessToken,refreshToken}


   } catch (error) {
      throw new ApiError(500,"something went wrong while generating refresh and access token");
      
   }
}


//logical of this code is writen in "readme.md file check video->13" //this is for registeruser
const registerUser = asynchandler(async(req,res) =>{
       const{fullName,email,username,password}= req.body
    //    console.log("email",email);
       console.log("BODY:", req.body);
       console.log("FILES:", req.files);

    //used from single declarartion of error   
    //    if (fullName === "") {
    //      throw new ApiError(400,"full name is  required")
    //    }

    //from multiple delclaring error
    if (    //validations
        [fullName,email,username,password].some((field)=>field?.trim() === "")
    ) {
        throw new ApiError(400,"all fiends is required")
    }


     //cheking for user alreadyexist
     const existedUser= await User.findOne({
        $or:[{ username },{ email }]
     })

     if (existedUser) {
        throw new ApiError(409,"user name or email allready exist")
     }
   //   console.log(req.file);



    //  check fro images ,check for avater
     const avatarLocalPath=req.files?.avatar[0]?.path //multer give the path of image/avatar //check every code using cansole.log
    //  const coverImageLocalPath=req.files?coverImage[0]?.path   //after comenting this code get error free,see video for understing

        let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && 
        req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path
    } //this code will resolve the error of "const coverImage"

     if (!avatarLocalPath) {
        throw new ApiError(400,"avatar file is required");
     }

     const avatar = await uploadOnCloudnary(avatarLocalPath);
     const coverImage= await uploadOnCloudnary(coverImageLocalPath) //this can throw error,for this we write new method down
    
     if(!avatar ){  //avatr validation
        throw new ApiError(400,"avatar file is required");
     }

    //  create user objects - create entry in db
    const user = await User.create({ //this all is from user model
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "", //check if coverImage present if present then take url if not remain empty""
        email,
        password,
        username:username.toLowerCase()   
    })
    console.log("✅ Inserted user into MongoDB:", user);
    //useing select() we select the element which we dont want or want
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
   //  const createdUser = await user.toObject(user._id).select("-password -refreshToken")
    
    if (!createdUser) { //validation / cheaking /check for user creation 
        throw new ApiError(500,"somthing went wrong while regrestring the user");
        
    }
     
    //return response
    return res.status(201).json(
           new ApiResponse(200,createdUser,"user registered successfully")//this is from Apiresponse file from util folder
    )
    
     })

// //this code is for loginuser ,video->15,logic of this code writen in "readme.md"file
const loginuser = asynchandler(async(req,res)=>{
      //req body ->data
      const {email,username,password} = req.body

      if (!email && !username) {
         throw new ApiError(400,"userName or email is required")
      }
      //if we have this both then can login,for that we have to find the user in database,code is below
     const user = await User.findOne({ //User is imported from model.js file
         $or : [{username},{email}] //hear we can pass obj's in array 
      })

      if (!user) { //if user not found then is will get exicute 
         throw new ApiError( 404,"user does not exist");
         
      }

      //if we get user then check passeord
      const isPasswordvalid =await user.isPasswordCorrect(password) //we gate the password from ispasswordCorrect which is from "user.model.js" file
      
      if (!isPasswordvalid) { //if pssword is invalid 
         throw new ApiError( 401,"password id incorrect")
      }

      //after chacking password make access and refresh token 
      //we make methood at top of the code name as:"generateAccessAndRefereshTokens" 
      const {accessToken,refreshToken}= await generateAccessAndRefereshTokens(user._id)

      const logedInUser=await User.findById(user.id).select("-password -refreshToken")

      //sending cookies
      const optins={
         httpOnly:true,
         secure:true
      }
      
      return res .status(200)
      .cookie("accessToken",accessToken,optins) //cookies method we get from aur "cookie-parser"(see)
      .cookie("refreshToken",refreshToken,optins)
      .json(
         new ApiResponse(
            200,
            {
                user:logedInUser,accessToken,refreshToken  
            },
            "user logedin successfully"
         )
      )

})

// //code for logout 
const logoutUser = asynchandler(async(req,res)=>{ //this code is for removing refreshToken from DB
   await User.findByIdAndUpdate(
      req.user._id, //finding id
      {
         $set:{   //this is mongoose operatore to cange or update
            refreshToken: undefined
         } 
      },
      {
         new:true     //using this we gate nwe value in response,after undefin the token
      } 
   ) 
   //cookise
   const options={
      httpOnly:true,
      secure:true
   }
   //now clare the cookies
   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "user logged out"))
}) 

// //code for refresh access Token //for be logedin continue login user 
const refreshAccessToken = asynchandler(async(req,res)=>
   {
      const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken 


      if (!incomingRefreshToken) {
         throw new ApiError(401,"unauthorized request");
      }

     try {
       const decodedToken =jwt.verify(
          incomingRefreshToken,
          process.env.REFRESH_TOKEN_SECRET
       )
 
       const user = await User.findById(decodedToken?._id)
       
       if (!user) {
          throw new ApiError(401,"invalid refresh token");
       }
 
       if (!incomingRefreshToken !== user ?. refreshToken) {
          throw new ApiError(401,"refresh token expired or used");
       }
       
       const optins ={
          httpOnly:true,
          secure:true
       }
   const{accessToken,newrefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
    return res
    .status(200)
    .cookie("accessToken",accessToken,optins)
    .cookie("refreshToken",newrefreshToken,optins)
    .json(
       200,
       {accessToken,refreshToken:newrefreshToken},
       "Access token refreshed"
    )
     } catch (error) {
      throw new ApiError(401,error?.message )
     }
})

export{
   registerUser,
   loginuser,
   logoutUser,
   refreshAccessToken
}


