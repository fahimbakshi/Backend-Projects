import { asynchandler } from "../utils/asynchandler.js"; //we taken the asynchandler.js filr from utils folder

//demo code:-

const registerUser = asynchandler(async(req,res) =>{
    console.log("error");
    
    res.status(200).json({
        message:"ok"
    })
})


//logical of thi code is writen in "readme.md file check video->13"
// const registerUser = asynchandler(async(req,res) =>{
//        const{fullName,email,userName,password}= req.body
//        console.log("email",email)
//     } )

// export{registerUser}


