import mongoose,{schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; 

const VideoSchema =new mongoose.Schema(
    {
        videoFile:{
            type:String,// we get this from cloudinary url
            required:true
        },
        thumnale:{
            type:String,// we get this from cloudinary url
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        duration:{     //cloudnary url
            type:Number, 
            required:true
        },
        view:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type:schema.Types.objectId,
            ref:"User"
        }
    },
    {
       timestamps:true
    }
) 

//using mongoose aggregate hear
//in mongoose documantion we use mongoose plugins in aur prog

VideoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",VideoSchema)


