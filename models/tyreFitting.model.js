// models/Doctor.js
import mongoose from "mongoose";

const tyreFittingSchema = new mongoose.Schema(
  {
    brand:{
      type: String,
      required: false,
    },
    size:{
        type: String,
        required: true,  
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

export const TyreFitting = mongoose.model("TyreFitting", tyreFittingSchema);
