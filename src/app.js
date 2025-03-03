import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN || 'http://localhost:5000' ,
    credentials:true
})) //app.use(cors()) is used to make midelware and configuration

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended :true , limit :"16kb"})) //making another cnfigure, which form ,when data coms from url
app.use(express.static("public"))//from saving files , image,etc "public" is aur folder which stores that data   

app.use(cookieParser())//to access the cookies of user by server


//routes import from routes folder
import userRouter from "./routes/user.routes.js"


//routes declaration (imp)
app.use("/api/v1/users",userRouter) //this call routes folder and  run the routes which is writen in that file

export {app} 


