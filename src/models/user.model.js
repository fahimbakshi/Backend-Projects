import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema =new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullnmae:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String, //hera we use cloudnary(application) url (where we aplode video or image and we get url)
            required:true, 
        },
        coverImage:{
            type:String, //hera we use cloudnary(application) url (where we aplode video or image and we get url)
          },
        watchHistory:[  //we use array bec we there are multipal valies to store
            {
                type: Schema.Types.objectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,`password is required`] //if we want to add more filds wecan use array 
        },
        refreshToken:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save",async function(next) {
    if(!this.isModified("password"))return next()//checks the if pasword is modified & if not modified then go to next

    this.password = bcrypt.hash(this.password,10) //encrypt the passsword //if pasw is modified the this get run
    next()    
}) //using hook of mongoose (see document of hook)

userSchema.methods.isPasswordCorrect = async function(passsword){
    return await bcrypt.compare(password,this.passsword)
} //made custon method from mongoose

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullnmae:this.fullnmae //payload(name):this.(com's from database)
        },
        process.env.ACCESS_TOKEN_SECRET, //access token from env filr, for this we also need to make expiry in object as shone bellow
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }    
    )//genrete token
}//jwt tokens
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,   
        },
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }    
    )
}//jwt tokens,same code as above function "generateAccessToken"



export const User = mongoose.model("USer",userSchema)