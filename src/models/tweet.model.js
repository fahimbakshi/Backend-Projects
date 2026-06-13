import mongoose , {Schema} from "mongoose";

const tweetSchema = new Schema(
    {
    content:{
        tpye:String,
        require:true        
    },
    owner:{
        tpye:Schema.Types.ObjectId,
        ref:"User "
    },
   likes: {
      type: Number,
      default: 0,
    },
},
  {
    timestamps: true,
  },
);

export const tweet = mongoose.model("tweet",tweetSchema);