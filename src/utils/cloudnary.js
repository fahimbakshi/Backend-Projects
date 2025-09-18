import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudnary =async(localFiilePath)=>{
    try {
        if (!localFiilePath) return null

        // Fix for Windows paths (convert \ to /)
        const normalizedPath = localFiilePath.replace(/\\/g, "/");

        //update the file on cloudnary
       const response = await cloudinary.uploader.upload(normalizedPath,{     //this method is referanced from cloudnary, we take this all in variable(response)      
            resource_type:'auto', //hear we can add tipe of uplode file 
            timeout: 120000, // 120 seconds
        }) 
        //filr has been uploded successfull
        console.log("filr is uploded secessfully on cloudnary",response.url); 
        fs.unlinkSync(localFiilePath) //after code run successfully uncommet thsi line
        return response;

    } catch (error) {
      console.error("Cloudinary upload failed:", error);
        if (fs.existsSync(localFiilePath)) {
      fs.unlinkSync(localFiilePath);
    }
    return null;
}
}

export{uploadOnCloudnary}


//taking this for teporary understing
// cloudinary.v2.uplaode(
//     'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
//     {  public_id: 'shoes' },
//     function(error,result) {console.log(result);});
