// models/Doctor.js
import mongoose from "mongoose";

const carWashingSchema = new mongoose.Schema(
  {
    carWashingName: {
        type: String,
        required: true,
      },
    carType: {
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

export const CarWashing = mongoose.model("CarWashing", carWashingSchema);
