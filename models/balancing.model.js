// models/Doctor.js
import mongoose from "mongoose";

const balancingSchema = new mongoose.Schema(
  {
    type:{
        type: String,
        required: true,  
    },
    price:{
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

export const Balancing = mongoose.model("Balancing", balancingSchema);
