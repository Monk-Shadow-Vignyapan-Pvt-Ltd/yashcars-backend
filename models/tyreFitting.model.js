// models/Doctor.js
import mongoose from "mongoose";

const tyreFittingSchema = new mongoose.Schema(
  {
    brand:{
      type: String,
      required: false,
    },
    tyreName:{
        type: String,
        required: true,  
    },
    type:{
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
    nextServicePeriod:{
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
