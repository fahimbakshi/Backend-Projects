       // hera we useing two type of approch to connect with DB 
// require('dotenv').config({path:'./env'})  //this is from 2 approch we can write this in formated manner showen bellow
// import dotenv, { config } from "dotenv"  //(2)

// // import mongoose from "mongoose";
// // import {DB_NAME} from "./constants"  //import's DB_NAME from constants file
// import connectDB from "./db/db.js";

// // approcch type :-2 (code not running)
// dotenv.config({         //config is method which takes object hear it takes "path"
//     path : './env'
// })


// connectDB()
// .then(()=>{
//     app.listen(process.env.port || 8000,()=>{
//         console.log(`server is running at port: ${process.env.port}`);
        
//     }) //if port not get then run on 8000
// })
// .catch((err)=>{
//     console.log(`mongoDB connection failed`,err);
    
// })



//*new code  (runing /runing  code)

import express from 'express';
import connectDB from "./db/db.js"; // Adjust path if necessary

const app = express();

// Connect to MongoDB
connectDB();

// Set up your app routes and middlewares
app.get('/', (req, res) => {
  res.send('MongoDB Connection Established!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});









// approcch type :-1 (code not working)
/*
import express from "express"
const  app = express()

( async() =>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI} / ${DB_NAME}`) //calling the DB URL stored in .env file
        app.on("error",error => {  //this pass is of express const aap declared above jere to app.listen
            console.log("error",error);
            throw error    
        } )        

        app.listen(process.env.port,()=>{  
            console.log(`app is listen at port ${process.env.port}`);
            
         })

    } catch (error) {
        console.log("error",error);
         throw err
    }
} ) ()
*/
