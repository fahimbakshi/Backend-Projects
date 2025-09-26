import mongoose , {Schema} from "mongoose";

const tweetSchema = new Schema({
    content:{
        tpye:String,
        require:true        
    },
    owner:{
        tpye:Schema.Types.ObjectId,
        ref:"User "
    }
},
{
    timestamps:true
})

export const tweet = mongoose.model("tweet",tweetSchema);