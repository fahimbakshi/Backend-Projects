import { asynchandler } from "../utils/asynchandler.js"; //we taken the asynchandler.js filr from utils folder
import {ApiError} from  "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudnary} from "../utils/cloudnary.js"
import{ApiResponse} from "../utils/ApiResponse.js"; //to return response at the end  
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

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
     const avatarLocalPath=req.files?.avatar[0]?.path; //multer give the path of image/avatar //check every code using cansole.log
    //  const coverImageLocalPath=req.files?coverImage[0]?.path   //after comenting this code get error free,see video for understing

        let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && 
        req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path;
    } //this code will resolve the error of "const coverImage"

     if (!avatarLocalPath) {
        throw new ApiError(400,"avatar file is required");
     }
     const avatar = await uploadOnCloudnary(avatarLocalPath);
     const coverImage= await uploadOnCloudnary(coverImageLocalPath); //this can throw error,for this we write new method down
    
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
         $unset:{   //this is mongoose operatore to cange or update
            refreshToken: 1 //this removes the fields from document 
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

// update
const changeCurrentPassword = asynchandler(async(req,res)=>{
   const {oldpassword,newpassword} =req.body
   
   const user = await User.findById(req.user?._id)
   const ispasswordCorrect =await user.isPasswordCorrect(oldpassword); //ispasswordCorrect we taken form the user model

   if(!ispasswordCorrect){
      throw new ApiError(400,"invalid old passwor");
   }
   // if password is correct then set new password
   user.password =newpassword
   await user.save({validateBeforeSave:false})

   return res
   .status(200)
   .json(new ApiResponse(200,{},"Password changed successfully"))
})

const getCurrentUser = asynchandler(async(req,res)=>{
   return res
   .status(200)
   .json(new ApiResponse(
       200 ,req.user,"current user fatch successfully"
      )) //from hera we can get corrent user 
})

const updateAccountDetail = asynchandler(async(req,res)=>{
   const {fullName,email} = req.body

   if(!fullName || !email){
      throw new ApiError(400,"All field are required");
   }
  const user = User.findByIdAndUpdate(
   req.user?._id,
   {
      $set:{//hrar we use $set operator of js
         fullName,
         email:email      
      }
   },
   {new:true} //after upadte we can see information
).select("-password")

   return res.status(200)
   .json(new ApiResponse(200,user,"Account details updated successfully"))
});

const updateUserAvatar =asynchandler(async(req,res)=>{
   const avatarLocalPath = req.file?.path;

   if (!avatarLocalPath){
      throw new ApiError(400,"avatar fiel is meassing");
   }
   const avatar = await uploadOnCloudnary(avatarLocalPath);

   if (!avatar.url){
      throw new ApiError(400,"error while uploding on avatar");
   }
   
  const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            avatar: avatar.url
         }
      },
      {new:true} 
   ).select("-password")
   
   return res 
   .status(200)
   .json(new ApiResponse(200,user,"Avatar image uploded success fully"))
} )

const updateUserCoverimage =asynchandler(async(req,res)=>{
   const CoverimageLocalPath = req.file?.path;

   if (!CoverimageLocalPath){
      throw new ApiError(400,"coverimaage fiel is meassing");
   }


                //TODO: delete old image - assignment


   const coverImage = await uploadOnCloudnary(CoverimageLocalPath);

   if (!coverImage.url){
      throw new ApiError(400,"error while uploding on coverimage");
   }
   
  const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            coverImage: coverImage.url
         }
      },
      {new:true} 
   ).select("-password")

   return res 
   .status(200)
   .json(new ApiResponse(200,user,"cover image uploded success fully"))
} )


const getuserchannelprofile =asynchandler(async(req,res)=>{
   const {username} = req.params

   if (!username?.trim){
      throw new ApiError()
   }

   //this are the mongibd pipelines
   const channel = await User.aggregate([   //this is used to do aggrigation which can also done by the mongodb
      {
         $match:{
            username:username?.toLowerCase
         }  
      },
      {
         $lookup:{   //hear we gate subscriber
            from:"subscriptions", //in model everythis is in lowercase and in pural form
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
         }
      },
      {
          $lookup:{ //hear we gate channel we subscribed to 
            from:"subscriptions", //in model everythis is in lowercase and in pural form
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribeedTo"
         }
      },
      {
         $addFields:{
            Subscribercount:{  ///for counting subscrigber
               $size:"$subscribers"  //for fields we use "$" symbol
            },
            channelsubscriberdTocount:{
               $size:"$subscribeedTo"
            },
            isSubscribed:{  //for subscribe buton subscribed or not (logic)
               $cond:{
                  if: {$in:[req.user?._id,"$subscribers.subscriber"]},
                  then:true,
                  else:false
               }
            }
         }
      },
      {
         $project:{  //form presenting fields on frounted for the user(things to show in frunt)
            fullName:1,
            username:1,
            suSubscribercount:1,
            channelsubscriberdTocount:1,
            isSubscribed:1,
            avatar:1,
            coverImage:1,
            email:1
         }
      }
   ])
   if(!channel?.length){
      throw new ApiError(400,"channel dose not exist")
   }
   return res
   .status(200)
   .json(
      new ApiResponse(200,channel[0],"user channel featched successfully")
   )
})

const getWatchHistory = asynchandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "video",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [  //watervar ve do inthis pipeline will go in owner field( as: "owner")
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})


export{
   registerUser,
   loginuser,
   logoutUser,
   refreshAccessToken,
   changeCurrentPassword,
   getCurrentUser,
   updateAccountDetail,
   updateUserAvatar,
   getuserchannelprofile,
   updateUserCoverimage,
   getWatchHistory,
}
