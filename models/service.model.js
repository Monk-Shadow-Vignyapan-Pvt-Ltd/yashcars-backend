// models/Doctor.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
    },
    serviceSubtitle: {
      type: String, // Store image as base64 or use a URL reference
      required: false,
    },
    serviceType: {
      type: String, // Store image as base64 or use a URL reference
      required: true,
    },
    serviceDescription: {
      type: String, // Store image as base64 or use a URL reference
      required: false,
    },
    serviceUsps: {
      type: mongoose.Schema.Types.Mixed, // Store image as base64 or use a URL reference
      required: false,
    },
    serviceQuality: {
      type: mongoose.Schema.Types.Mixed, // Store image as base64 or use a URL reference
      required: false,
    },
    schema: {
      type: String, // Store image as base64 or use a URL reference
      required: false,
    },
    serviceImage: {
      type: String,
      required: false,
    },
    serviceEnabled: {
      type: Boolean,
      required: true,
    },
    multiImages: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    warranty: {
      type: String,
      required: false,
    },
    hasWarranty: {
      type: Boolean,
      required: false,
    },
    serviceUrl: {
      type: String,
      required: false,
      unique: true,
    },
    serviceVideo: {
      type: String,
      required: false,
    },
    oldUrls: {
      type: mongoose.Schema.Types.Mixed,  // Use Mixed for flexible structure (JSON-like object)
      required: false
    },
    seoTitle: {
      type: String,
      required: false,
    },
    seoDescription: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);


export const Service = mongoose.model("Service", serviceSchema);
