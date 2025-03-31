// models/Doctor.js
import mongoose from "mongoose";

const audioWorkSchema = new mongoose.Schema(
  {
    audioWorkName: {
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

export const AudioWork = mongoose.model("AudioWork", audioWorkSchema);
