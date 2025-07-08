// models/Doctor.js
import mongoose from "mongoose";

const otherJobWorkSchema = new mongoose.Schema(
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

export const OtherJobWork = mongoose.model("OtherJobWork", otherJobWorkSchema);
