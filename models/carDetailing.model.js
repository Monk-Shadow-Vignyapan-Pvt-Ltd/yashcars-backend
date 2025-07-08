// models/Doctor.js
import mongoose from "mongoose";

const carDetailingSchema = new mongoose.Schema(
  {
    carDetailingName: {
      type: String,
      required: true,
    },
    carType: {
        type: String,
        required: true,
      },
    brand:{
      type: String,
      required: false,
    },
    priceType: {
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

export const CarDetailing = mongoose.model("CarDetailing", carDetailingSchema);
