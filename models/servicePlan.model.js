// models/Doctor.js
import mongoose from "mongoose";


const servicePlanSchema = new mongoose.Schema({
    purchaseType:{
        type: String,
        required: true,
    },
    carBrand:{
        type: String,
        required: false,
    },
    carName:{
        type: String,
        required: false,
    },
    jobNo: {
        type: String,
        required: true,
    },
    milege:{
        type: String,
        required: false,
    },
    jobDate:{
        type:Date,
            required: false,
    },
    deliveryDate:{
        type:Date,
            required: false,
    },
    advisor:{
      type:mongoose.Schema.Types.Mixed,
            required: false,
    },
    carNo: {
        type: String,
        required: false,
    },
    servicePlan:{
      type:mongoose.Schema.Types.Mixed,
            required: false,
    },
    subTotal:{
      type:mongoose.Schema.Types.Mixed,
            required: false,
    },
    gst:{
      type:mongoose.Schema.Types.Mixed,
            required: false,
    },
    grandTotal:{
      type:mongoose.Schema.Types.Mixed,
            required: false,
    },
    status:{
        type:String,
        required: false,
    },
    uploads:{
        type:mongoose.Schema.Types.Mixed,
            required: false,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
}, { timestamps: true });

export const ServicePlan = mongoose.model("ServicePlan", servicePlanSchema);
