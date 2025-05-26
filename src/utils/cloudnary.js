import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


cloudinary.config({
    cloud_name:process.env.CLOUDNARY_CLOUD_NAME,
    api_key:process.env.CLOUDNARY_API_KEY,
    api_secret:process.env.CLOUDNARY_API_SECRET,
});


const uploadOnCloudnary =async(localFiilePath)=>{
    try {
        if (!localFiilePath) return null
        //update the file on cloudnary
       const response = await cloudinary.uploader.upload(localFiilePath,{     //this method is referanced from cloudnary, we take this all in variable(response)      
            resource_type:'auto' //hear we can add tipe of uplode file 
        }) 
        //filr has been uploded successfull
        console.log("filr is uploded secessfully on cloudnary",response.url); 
        // fs.unlinkSync(localFiilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFiilePath)//remove local saved temporary file as the upload operation got faield
        return null;
    }
}

export{uploadOnCloudnary}


//taking this for teporary understing
// cloudinary.v2.uplaode(
//     'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
//     {  public_id: 'shoes' },
//     function(error,result) {console.log(result);});
