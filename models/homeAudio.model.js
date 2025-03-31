// models/Doctor.js
import mongoose from "mongoose";

const homeAudioSchema = new mongoose.Schema(
  {
    inventoryName: {
      type: String,
      required: true,
    },
    brand:{
      type: String,
      required: false,
    },
    price:{
        type: String,
        required: false, 
    },
    warranty:{
        type: String,
        required: false, 
    },
    userId: {
       type:mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export const HomeAudio = mongoose.model("HomeAudio", homeAudioSchema);
