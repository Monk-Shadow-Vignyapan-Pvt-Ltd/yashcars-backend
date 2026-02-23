// models/Doctor.js
import mongoose from "mongoose";

const webbrandSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
    },
    brandImage: {
      type: String, // Store image as base64 or use a URL reference
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: true }
);

export const WebBrand = mongoose.model("WebBrand", webbrandSchema);
