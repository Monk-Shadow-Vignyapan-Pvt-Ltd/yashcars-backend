import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
        type: String,
        required: false,
        trim: true,
    },
    alternatePhone: {
        type: String,
        required: false,
        trim: true,
    },
    email: {
        type: String,
        required: false,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], // Basic email validation
    },
    address : {
        type: String,
        required: false,
      },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);
