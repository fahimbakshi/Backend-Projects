//(1) code not runnig
// import mongoose from "mongoose";
// import {DB_NAME} from "../constants.js";


// const connectDB = async () =>{
//     try {
//     const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) //we can store this in variable like we using const in this line
//      console.log(`\n mongoDB connected !! DB host:${connectionInstance}`);
     
//     } catch (error) {
//         console.log("MONGODB connection error",error); // if we have any problem of connection of DB we gate this error on terminal
//         process.exit(1)
//     }
// }

// export default connectDB;





// (2) runnig code

//* main running code , this code will be alwase same for every databse

import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    const connectionURI = process.env.MONGODB_URI; // Get the URI from the .env file
    console.log('Connecting to MongoDB...');

    // Mongoose 6.x automatically handles connection options
    const connectionInstance = await mongoose.connect(connectionURI);

    console.log(`MongoDB connected! DB host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection error:", error);
    process.exit(1); // Exit process if there's a connection error
  }
};

export default connectDB;
