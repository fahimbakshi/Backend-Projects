import mongoose, { Schema, Types } from "mongoose";
import { Video } from "./video.model";
import { comment } from "./comments.model";

const likeSchema = new Schema(
    {
        Video:{
            type:Schema.Types.ObjectId,
            ref:"Video"
        },
        comment:{
            type:Schema.Types.ObjectId,
            ref:"comment"
        },
        tweet:{
            type:Schema.Types.ObjectId,
            ref:"tweet"
        },
        likedBY:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true
    }
)

export const like = mongoose.model("like",likeSchema);