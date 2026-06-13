import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN || 'http://localhost:5000' ,
    credentials:true
})) //app.use(cors()) is used to make midelware and configuration

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended :true , limit :"16kb"})) //making another cnfigure, which from ,when data coms from url
app.use(express.static("public"))//from saving files , image,etc "public" is aur folder which stores that data   

app.use(cookieParser())//to access the cookies of user by server


//routes import from routes folder
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.router.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comment.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"

//routes declaration (imp)
app.use("/api/v1/users",userRouter) //this call routes folder and  run the routes which is writen in that file
app.use("/api/v1/video",videoRouter)
app.use("/api/v1/dashboard",dashboardRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/healthcheck",healthcheckRouter)
app.use("/api/v1/subscription",subscriptionRouter)

export {app}; 


